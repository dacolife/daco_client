pragma solidity ^0.4.23;

// File: contracts/common/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;


    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    function Ownable() {
        owner = msg.sender;
    }


    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }


    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) onlyOwner public {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

}

// File: contracts/common/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

// File: contracts/common/RefundCharity.sol

/**
 * @title RefundVault
 * @dev This contract is used for storing funds while a donations
 * is in progress. Supports refunding the money if donations fails,
 * and forwarding it if donation is successful.
 */
contract RefundVault is Ownable {
  using SafeMath for uint256;

  enum State { Active, Refunding, Closed }

  mapping (address => uint256) public deposited;
  address[] public wallets;
  uint256[] public amounts;
  State public state;

  event Closed();
  event RefundsEnabled();
  event Refunded(address indexed beneficiary, uint256 weiAmount);

  /**
   * @param _wallets Vault addresses
   */
  function RefundVault(address[] _wallets, uint256[] _amounts) public {
    require(_wallets.length == _amounts.length);

    for (uint i = 0; i < _wallets.length; i++) {
      require(_wallets[i] != address(0));
      require(_amounts[i] > 0);
    }
    wallets = _wallets;
    amounts = _amounts;
    state = State.Active;
  }

  /**
   * @param investor Investor address
   */
  function deposit(address investor) onlyOwner public payable {
    require(state == State.Active);
    deposited[investor] = deposited[investor].add(msg.value);
  }

  function close() onlyOwner public {
    require(state == State.Active);
    state = State.Closed;
    emit Closed();
    for (uint i = 0; i < wallets.length; i++) {
      wallets[i].send(amounts[i]);
    }
  }

  function enableRefunds() onlyOwner public {
    require(state == State.Active);
    state = State.Refunding;
    emit RefundsEnabled();
  }

  /**
   * @param investor Investor address
   */
  function refund(address investor) public {
    require(state == State.Refunding);
    uint256 depositedValue = deposited[investor];
    deposited[investor] = 0;
    investor.transfer(depositedValue);
    emit Refunded(investor, depositedValue);
  }
}

/**
 * @title RefundCharity
 * @dev RefundCharity is a contract for managing a crowd charity campaign
 */

contract RefundCharity is Ownable {
  using SafeMath for uint256;

  // Address where funds are collected
  address[] public wallets;

  // amount of funds to be raised in weis for wallets
  uint256[] public goals;

  // amount of funds to be raised in weis
  uint256 public goal;

  // refund vault used to hold funds while donations is running
  RefundVault public vault;

  // Amount of wei raised
  uint256 public weiRaised;

  uint256 public openingTime;
  uint256 public closingTime;

  bool public isFinalized = false;

  event Finalized();

  /**
   * Event for donate logging
   * @param purchaser who paid
   * @param value weis paid for purchase
   */
  event Donate(address indexed purchaser, uint256 value);

  /**
   * @dev Reverts if not in donations time range.
   */
  modifier onlyWhileOpen {
    // solium-disable-next-line security/no-block-members
    require(block.timestamp >= openingTime && block.timestamp <= closingTime);
    _;
  }

  // -----------------------------------------
  // External interface
  // -----------------------------------------

  /**
   * @dev fallback function ***DO NOT OVERRIDE***
   */
  function () external payable {
    donate(msg.sender);
  }

  /**
   * @dev low level donations ***DO NOT OVERRIDE***
   * @param _beneficiary Address who make donation
   */
  function donate(address _beneficiary) public payable {

    uint256 weiAmount = msg.value;

    uint256 change = 0;
    uint256 needed = goal.sub(weiRaised);

    if (weiAmount > needed) {
      change = weiAmount.sub(needed);
      weiAmount = needed;
    }

    if (change > 0) {
      _beneficiary.transfer(change);
    }

    _preValidatePurchase(_beneficiary, weiAmount);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    emit Donate(msg.sender, weiAmount);

    _forwardFunds(weiAmount);
    _postValidatePurchase(_beneficiary, weiAmount);
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------

  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
   * @param _beneficiary Address performing the donation
   * @param _weiAmount Value in wei involved in the purchase
   */
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal onlyWhileOpen {
    require(_beneficiary != address(0));
    require(_weiAmount != 0);
    require(weiRaised.add(_weiAmount) <= goal);
  }

  /**
   * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid conditions are not met.
   * @param _beneficiary Address performing the donation
   * @param _weiAmount Value in wei involved in the purchase
   */
  function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    // optional override
  }

  /**
   * @dev Determines how ETH is stored/forwarded - sending funds to vault.
   */
  function _forwardFunds(uint256 _weiAmount) internal {
    vault.deposit.value(_weiAmount)(msg.sender);
  }

  /**
   * @dev Checks whether the period in which the donations is open has already elapsed.
   * @return Whether donations period has elapsed
   */
  function hasClosed() public view returns (bool) {
    // solium-disable-next-line security/no-block-members
    return block.timestamp > closingTime;
  }

  /**
   * @dev Checks whether the goal has been reached.
   * @return Whether the goal was reached
   */
  function goalReached() public view returns (bool) {
    return weiRaised >= goal;
  }

  /**
   * @param _wallets Address where collected funds will be forwarded to
   * @param _goals Donations goal
   * @param _closingTime Donation closing time
   */
  function RefundCharity(
    address[] _wallets,
    uint256[] _goals,
    uint256 _closingTime
  )
  public
  {
    require(_wallets.length == _goals.length);

    for (uint i = 0; i < _wallets.length; i++) {
      require(_wallets[i] != 0x0);
      require(_goals[i] > 0);
      goal = goal.add(_goals[i]);
    }

    require(_closingTime >= block.timestamp);

    wallets = _wallets;

    openingTime = now;
    closingTime = _closingTime;

    vault = new RefundVault(_wallets, _goals);
    goals = _goals;
  }

  /**
   * @dev Must be called after campaign ends, to do some extra finalization
   * work. Calls the contract's finalization function.
   */
  function finalize() public {
    require(!isFinalized);
    require(hasClosed() || goalReached());

    finalization();
    emit Finalized();

    isFinalized = true;
  }

  /**
   * @dev Donators can claim refunds here if donations is unsuccessful
   */
  function claimRefund() public {
    require(isFinalized);
    require(!goalReached());

    vault.refund(msg.sender);
  }

  /**
   * @dev vault finalization task, called when owner calls finalize()
   */
  function finalization() internal {
    if (goalReached()) {
      vault.close();
    } else {
      vault.enableRefunds();
    }
  }
}

// File: contracts/common/RefundCharityFabricInterface.sol

/**
 * @title RefundCharityFabric
 * @dev RefundCharity is a contract for creating a crowd charity campaign
 */

contract RefundCharityFabricInterface {
  using SafeMath for uint256;

  function create(
    address[] _wallets,
    uint256[] _goals,
    uint256 _closingTime
  ) public returns (RefundCharity);
}

// File: contracts/main.sol

/**
 * @title DACO congress contract
 * @dev http://daco.life
 */
contract DACOMain is Ownable {
    
    using SafeMath for uint256;
    
    /**
     * @dev Minimal quorum value
     */
    uint256 public minimumQuorum;

    /**
     * @dev Fabric for creating refund campaign
     */
    address public refundCharityFabric;

    /**
     * @dev Majority margin is used in voting procedure
     */
    uint256 public majorityMargin;


    // ---====== MEMBERS ======---
    /**
     * @dev Get delegate object by account address
     */
    mapping(address => Member) members;

    /**
     * @dev Congress members addresses list
     */
    address[] public membersAddr;

    /**
     * @dev Count of members in archive
     */
    function numMembers() public view returns (uint256)
    { return membersAddr.length; }


    // ---====== CAMPAIGNS ======---
    /**
     * @dev Get campaign object by campaign hash
     */
    mapping(bytes32 => Campaign) campaigns;

    /**
     * @dev Campaigns hashes list
     */
    bytes32[] public campaignsHash;

    /**
     * @dev Count of campaigns in list
     */
    function numCampaigns() public view returns (uint256)
    { return campaignsHash.length; }



    // ---====== PROPOSALS ======---
    /**
     * @dev List of all proposals hashes
     */
    bytes32[] public proposalsHash;

    /**
     * @dev Count of proposals in list
     */
    function numProposals() public view returns (uint256)
    { return proposalsHash.length; }



    // ---====== FINISHED CAMPAIGNS ======---
    /**
     * @dev Campaigns list
     */
    bytes32[] public finishedCampaignsHash;

    /**
     * @dev Count of campaigns in list
     */
    function numFinishedCampaigns() public view returns (uint256)
    { return finishedCampaignsHash.length; }



    /**
     * @dev On proposal added
     * @param sender Sender address
     * @param hash Campaign hash
     * @param description Description
     * @param link Link to site
     */
    event ProposalAdded(
        address indexed sender,
        bytes32 indexed hash,
        string description,
        string link
    );

    /**
     * @dev On campaign added
     * @param sender Sender address
     * @param hash Campaign hash
     * @param description Description
     * @param link Link to site
     */
    event CampaignAdded(
        address indexed sender,
        bytes32 indexed hash,
        string description,
        string link
    );

    /**
     * @dev On proposal passed
     * @param sender Sender address
     * @param hash Campaign hash
     * @param owner Owner address
     * @param description Description
     * @param link Link to site
     */
    event ProposalPassed(
        address indexed sender,
        bytes32 indexed hash,
        address indexed owner,
        string description,
        string link
    );

    /**
     * @dev On vote by member accepted
     * @param sender Proposal sender
     * @param hash Campaign hash
     * @param supportsProposal Support proposal
     * @param comment Comment
     */
    event Voted(
        address indexed sender,
        bytes32 indexed hash,
        bool indexed supportsProposal,
        string comment
    );

    /**
     * @dev On finish campaign
     * @param sender Proposal sender
     * @param hash Campaign hash
     * @param raisedAmount Raised amount
     * @param report Report
     */
    event FinishCampaign(
        address indexed sender,
        bytes32 indexed hash,
        uint256 indexed raisedAmount,
        string report
    );

    /**
     * @dev create new donations contract
     * @param sender Sender
     * @param hash Campaign hash
     * @param donation address for donations
     */
    event CreateDonationContract(
        address indexed sender,
        bytes32 indexed hash,
        address indexed donation
    );

    /**
     * @dev On changed membership
     * @param member Account address
     * @param isMember Is account member now
     */
    event MembershipChanged(
        address indexed member,
        bool    indexed isMember
    );

    /**
     * @dev On changed membership
     * @param charityFabric Address fabric
     */
    event CharityFabricChanged(
        address indexed charityFabric
    );

    /**
     * @dev On voting rules changed
     * @param minimumQuorum New minimal count of votes
     * @param majorityMargin New majority margin value
     */
    event ChangeOfRules(
        uint256 indexed minimumQuorum,
        uint256 indexed majorityMargin
    );

    struct Campaign {
        bool isProposal;
        bool isCampaign;
        bool isFinishedCampaign;

        uint indexProposal;
        uint indexCampaign;
        uint indexFinishedCampaign;

        address owner;
        address[] wallets;
        uint256[] amounts;
        uint256 amount;
        string  description;
        string  link;

        address donationContract;

        address[] votesAddr;
        mapping(address => bool) voted;
        mapping(address => Vote) voteData;

        uint256 numberOfVotes;
        uint256 currentResult;

        uint256 proposalDate;
        bool proposalRejected;

        uint256 campaignDate;
        uint256 endDate;

        uint256 finishDate;
        uint256 raisedAmount;
        string  report;
    }

    struct Vote {
        bool supportsProposal;
        address sender;
        string comment;
    }

    struct Member {
        address member;
        bool active;
        bool isMember;
        string  name;
        string  link;
        uint256 memberSince;
        bytes32[] campaignsHash;
        bytes32[] finishedCampaignsHash;
        uint index;
    }

    /**
     * @dev Modifier that allows only shareholders to vote and create new proposals
     */
    modifier onlyMembers {
        require (members[msg.sender].isMember);
        require (members[msg.sender].active);
        _;
    }

    /**
     * @dev First time setup
     */
    function DACOMain(address _refundCharityFabric) public {
        setCharityFabric(_refundCharityFabric);
        changeVotingRules(1, 1);
    }

    /**
     * @dev Get member
     * @param _address Member account address
     */
    function getMember(address _address) public view returns (
        bool active,
        bool isMember,
        string name,
        string link,
        uint256 memberSince,
        uint256 countCampaigns,
        uint256 countFinishedCampaigns
    ) {
        return (
            members[_address].active,
            members[_address].isMember,
            members[_address].name,
            members[_address].link,
            members[_address].memberSince,
            members[_address].campaignsHash.length,
            members[_address].finishedCampaignsHash.length
        );
    }

    /**
     * @dev Get campaign common information
     * @param _hash Campaign hash key
     */
    function getCampaignCommonInfo(bytes32 _hash) public view returns (
        bool isProposal,
        bool isCampaign,
        bool isFinishedCampaign,
        address owner,
        uint256 endDate,
        uint256 amount,
        string description
    ) {
        return (
            campaigns[_hash].isProposal,
            campaigns[_hash].isCampaign,
            campaigns[_hash].isFinishedCampaign,
            campaigns[_hash].owner,
            campaigns[_hash].endDate,
            campaigns[_hash].amount,
            campaigns[_hash].description
        );
    }

    /**
     * @dev Get info for proposals
     * @param _hash Campaign hash
     */
    function getCampaignProposalInfo(bytes32 _hash) public view returns (
        bool isProposal,
        string link,
        uint256 countVotes,
        uint256 currentResult,
        uint256 proposalDate,
        bool proposalRejected
    ) {
        return (
            campaigns[_hash].isProposal,
            campaigns[_hash].link,
            campaigns[_hash].votesAddr.length,
            campaigns[_hash].currentResult,
            campaigns[_hash].proposalDate,
            campaigns[_hash].proposalRejected
        );
    }

    /**
     * @dev Get info for active campaigns
     * @param _hash Campaign hash
     */
    function getCampaignActiveInfo(bytes32 _hash) public view returns (
        bool isCampaign,
        string link,
        uint256 countVotes,
        uint256 currentResult,
        uint256 proposalDate,
        uint256 campaignDate,
        address donationContract
    ) {
        return (
            campaigns[_hash].isCampaign,
            campaigns[_hash].link,
            campaigns[_hash].votesAddr.length,
            campaigns[_hash].currentResult,
            campaigns[_hash].proposalDate,
            campaigns[_hash].campaignDate,
            campaigns[_hash].donationContract
        );
    }

    /**
     * @dev Get info for finished campaigns
     * @param _hash Campaign hash
     */
    function getCampaignFinishedInfo(bytes32 _hash) public view returns (
        string link,
        uint256 countVotes,
        uint256 campaignDate,
        uint256 finishDate,
        uint256 raisedAmount,
        string report,
        address donationContract
    ) {
        return (
            campaigns[_hash].link,
            campaigns[_hash].votesAddr.length,
            campaigns[_hash].campaignDate,
            campaigns[_hash].finishDate,
            campaigns[_hash].raisedAmount,
            campaigns[_hash].report,
            campaigns[_hash].donationContract
        );
    }

    /**
     * @dev Get info for campaigns indexes
     * @param _hash Campaign hash
     */
    function getCampaignIndexInfo(bytes32 _hash) public view returns (
        uint indexProposal,
        uint indexCampaign,
        uint indexFinishedCampaign
    ) {
        return (
            campaigns[_hash].indexProposal,
            campaigns[_hash].indexCampaign,
            campaigns[_hash].indexFinishedCampaign
        );
    }

    /**
     * @dev Get member who vote for campaign
     * @param _hash Campaign hash
     * @param _index Member index
     */
    function getCampaignVoteMemberAddress(bytes32 _hash, uint256 _index) public view returns (
        address
    ) {
        return (
            campaigns[_hash].votesAddr[_index]
        );
    }

    /**
     * @dev Get campaign
     * @param _hashCampaign Campaign hash
     * @param _addressMember Member address
     */
    function getCampaignVoteObject(bytes32 _hashCampaign, address _addressMember) public view returns (
        bool supportsProposal,
        address sender,
        string comment
    ) {
        return (
            campaigns[_hashCampaign].voteData[_addressMember].supportsProposal,
            campaigns[_hashCampaign].voteData[_addressMember].sender,
            campaigns[_hashCampaign].voteData[_addressMember].comment
        );
    }

    /**
     * @dev Get member campaign
     * @param _addressMember Member address
     * @param _index Campaign index
     */
    function getMemberCampaignAddress(address _addressMember, uint256 _index) public view returns (
        bytes32
    ) {
        return (
            members[_addressMember].campaignsHash[_index]
        );
    }

    /**
     * @dev Get member campaign
     * @param _addressMember Member address
     * @param _index Campaign index
     */
    function getMemberFinishedCampaignAddress(address _addressMember, uint256 _index) public view returns (
        bytes32
    ) {
        return (
            members[_addressMember].finishedCampaignsHash[_index]
        );
    }

    /**
     * @dev Add new congress member
     * @param _targetMember Member account address
     * @param _memberName Member full name
     * @param _memberLink Member site
     */
    function addMember(address _targetMember, string _memberName, string _memberLink) public onlyOwner {
        require(_targetMember != 0x0);
        require(!members[_targetMember].isMember);

        members[_targetMember].index = membersAddr.push(_targetMember) - 1;
        members[_targetMember].active = true;
        members[_targetMember].isMember = true;

        members[_targetMember].member = _targetMember;
        members[_targetMember].name = _memberName;
        members[_targetMember].link = _memberLink;
        members[_targetMember].memberSince = now;

        MembershipChanged(_targetMember, true);
    }

    /**
     * @dev set fabric for creating new smart contracts
     * @param _newCharityFabric address of new fabric
     */
    function setCharityFabric(address _newCharityFabric) public onlyOwner {
        require(_newCharityFabric != 0x0);
        refundCharityFabric = _newCharityFabric;

        CharityFabricChanged(refundCharityFabric);
    }

    /**
     * @dev Remove congress member
     * @param _targetMember Member account address
     */
    function removeMember(address _targetMember) public onlyOwner {
        require(members[_targetMember].isMember);

        members[_targetMember].active = false;
        members[_targetMember].isMember = false;

        uint rowToDelete = members[_targetMember].index;
        address keyToMove   = membersAddr[membersAddr.length-1];
        membersAddr[rowToDelete] = keyToMove;
        members[keyToMove].index = rowToDelete;
        membersAddr.length--;

        MembershipChanged(_targetMember, false);
    }

    /**
     * @dev Activate member
     * @param _targetMember Member account address
     */
    function activateMember(address _targetMember) public onlyOwner {
        require(members[_targetMember].isMember);
        members[_targetMember].active = true;

        MembershipChanged(_targetMember, true);
    }

    /**
     * @dev Activate member
     * @param _targetMember Member account address
     */
    function deactivateMember(address _targetMember) public onlyOwner {
        require(members[_targetMember].isMember);
        members[_targetMember].active = false;

        MembershipChanged(_targetMember, false);
    }

    /**
     * @dev Change rules of voting
     * @param _minimumQuorumForProposals Minimal count of votes
     * @param _marginOfVotesForMajority Majority margin value
     */
    function changeVotingRules(
        uint256 _minimumQuorumForProposals,
        uint256 _marginOfVotesForMajority
    )
    public onlyOwner
    {
        minimumQuorum           = _minimumQuorumForProposals;
        majorityMargin          = _marginOfVotesForMajority;

        ChangeOfRules(minimumQuorum, majorityMargin);
    }

    /**
     * @dev Create a new proposal
     * @param _wallets Beneficiary account addresses
     * @param _amounts Amount values in wei
     * @param _endDate End date
     * @param _description Description string
     * @param _link Link
     */
    function newProposal(
        address[] _wallets,
        uint256[] _amounts,
        uint256 _endDate,
        string  _description,
        string  _link
    )
    public
    returns (uint256 id)
    {
        require(_endDate > block.timestamp);

        require(_wallets.length <= 10);
        require(_wallets.length == _amounts.length);

        uint256 amount = 0;
        for (uint i = 0; i < _wallets.length; i++) {
            require(_wallets[i] != 0x0);
            require(_amounts[i] > 0);
            amount = amount.add(_amounts[i]);
        }

        bytes32 _hash = generateHash(_wallets);

        campaigns[_hash].indexProposal = proposalsHash.push(_hash) - 1;
        campaigns[_hash].isProposal = true;
        campaigns[_hash].isCampaign = false;
        campaigns[_hash].isFinishedCampaign = false;

        campaigns[_hash].owner = msg.sender;
        campaigns[_hash].wallets = _wallets;
        campaigns[_hash].amounts = _amounts;
        campaigns[_hash].amount = amount;
        campaigns[_hash].endDate = _endDate;
        campaigns[_hash].description = _description;
        campaigns[_hash].link = _link;
        campaigns[_hash].numberOfVotes = 0;
        campaigns[_hash].currentResult = 0;
        campaigns[_hash].proposalDate = now;
        campaigns[_hash].proposalRejected = false;

        ProposalAdded(msg.sender, _hash, _description, _link);
    }

    /**
     * @dev Create a new campaign
     * @param _wallets Beneficiary account address
     * @param _amounts Amount value in wei
     * @param _endDate End date
     * @param _description Description string
     * @param _link Link
     * @param _comment Comment
     */
    function newCampaign(
        address[] _wallets,
        uint256[] _amounts,
        uint256 _endDate,
        string  _description,
        string  _link,
        string  _comment
    )
    public
    onlyMembers
    returns (address)
    {
        require(_endDate > block.timestamp);

        require(_wallets.length <= 10);
        require(_wallets.length == _amounts.length);

        uint256 amount = 0;
        for (uint i = 0; i < _wallets.length; i++) {
            require(_wallets[i] != 0x0);
            require(_amounts[i] > 0);
            amount = amount.add(_amounts[i]);
        }

        bytes32 _hash = generateHash(_wallets);

        campaigns[_hash].indexCampaign = campaignsHash.push(_hash) - 1;
        campaigns[_hash].isProposal = false;
        campaigns[_hash].isCampaign = true;
        campaigns[_hash].isFinishedCampaign = false;

        campaigns[_hash].owner = msg.sender;
        campaigns[_hash].wallets = _wallets;
        campaigns[_hash].amounts = _amounts;
        campaigns[_hash].amount = amount;
        campaigns[_hash].endDate = _endDate;
        campaigns[_hash].description = _description;
        campaigns[_hash].link = _link;
        campaigns[_hash].numberOfVotes = 1;
        campaigns[_hash].currentResult = 1;
        campaigns[_hash].proposalDate = now;
        campaigns[_hash].campaignDate = now;
        campaigns[_hash].proposalRejected = false;
        campaigns[_hash].voted[msg.sender] = true;
        campaigns[_hash].votesAddr.push(msg.sender);

        members[msg.sender].campaignsHash.push(_hash);

        Vote memory v;
        v.supportsProposal = true;
        v.sender = msg.sender;
        v.comment = _comment;

        campaigns[_hash].voteData[msg.sender] = v;

        CampaignAdded(msg.sender, _hash, _description, _link);

        return createDonationsContract(_hash);
    }

    /**
     * @dev Proposal voting
     * @param _hash Campaign hash
     * @param _supportsProposal Is member support proposal
     * @param _comment Comment
     */
    function vote(
        bytes32 _hash,
        bool _supportsProposal,
        string _comment
    )
    public
    onlyMembers
    returns (bool)
    {
        require(campaigns[_hash].isProposal);
        require(!campaigns[_hash].isCampaign);
        require(!campaigns[_hash].isFinishedCampaign);

        require(!campaigns[_hash].voted[msg.sender]);
        require(!campaigns[_hash].proposalRejected);

        campaigns[_hash].voted[msg.sender] = true; // Set this voter as having voted
        campaigns[_hash].votesAddr.push(msg.sender);

        Vote memory v;
        v.supportsProposal = _supportsProposal;
        v.sender = msg.sender;
        v.comment = _comment;

        campaigns[_hash].voteData[msg.sender] = v;

        campaigns[_hash].numberOfVotes++; // Increase the number of votes
        if (_supportsProposal) { // If they support the proposal
            campaigns[_hash].currentResult++; // Increase score
        }

        members[msg.sender].campaignsHash.push(_hash);

        // Create a log of this event
        Voted(msg.sender, _hash,  _supportsProposal, _comment);

        if (campaigns[_hash].numberOfVotes >= minimumQuorum) {
            if (campaigns[_hash].currentResult >= majorityMargin) {
                // Proposal passed; remove from proposalsHash and create campaign
                uint rowToDelete = campaigns[_hash].indexProposal;
                bytes32 keyToMove   = proposalsHash[proposalsHash.length-1];
                proposalsHash[rowToDelete] = keyToMove;
                campaigns[keyToMove].indexProposal = rowToDelete;
                proposalsHash.length--;

                campaigns[_hash].indexProposal = 0;
                campaigns[_hash].indexCampaign = campaignsHash.push(_hash) - 1;
                campaigns[_hash].isProposal = false;
                campaigns[_hash].isCampaign = true;
                campaigns[_hash].isFinishedCampaign = false;

                campaigns[_hash].campaignDate = now;

                ProposalPassed(msg.sender, _hash, campaigns[_hash].owner, campaigns[_hash].description, campaigns[_hash].link);

                createDonationsContract(_hash);
            } else {
                // Proposal failed
                campaigns[_hash].proposalRejected = true;
            }
        }

        return true;
    }

    /**
     * @dev Finish a campaign
     * @param _hash Campaign hash
     * @param _raisedAmount Raised amount value in wei
     * @param _report Report
     */
    function finishCampaign(
        bytes32 _hash,
        uint256 _raisedAmount,
        string _report
    )
    public
    onlyMembers
    returns (bool)
    {
        require(!campaigns[_hash].isProposal);
        require(campaigns[_hash].isCampaign);
        require(!campaigns[_hash].isFinishedCampaign);

        require(campaigns[_hash].voted[msg.sender]);
        require(!campaigns[_hash].proposalRejected);

        // Campaign finished; remove from campaignsHash and create finished campaign
        uint rowToDelete = campaigns[_hash].indexCampaign;
        bytes32 keyToMove   = campaignsHash[campaignsHash.length-1];
        campaignsHash[rowToDelete] = keyToMove;
        campaigns[keyToMove].indexCampaign = rowToDelete;
        campaignsHash.length--;

        campaigns[_hash].indexProposal = 0;
        campaigns[_hash].indexCampaign = 0;
        campaigns[_hash].indexFinishedCampaign = finishedCampaignsHash.push(_hash) - 1;
        campaigns[_hash].isProposal = false;
        campaigns[_hash].isCampaign = false;
        campaigns[_hash].isFinishedCampaign = true;

        campaigns[_hash].finishDate        = now;
        campaigns[_hash].raisedAmount      = _raisedAmount;
        campaigns[_hash].report            = _report;

        members[msg.sender].finishedCampaignsHash.push(_hash);

        FinishCampaign(msg.sender, _hash, _raisedAmount, _report);
        
        return true;
    }

    /**
     * @dev Create contract for donations
     * @param _hash Campaign hash
     */
    function createDonationsContract(
        bytes32 _hash
    )
    internal
    returns (address)
    {
        require(!campaigns[_hash].isProposal);
        require(campaigns[_hash].isCampaign);
        require(!campaigns[_hash].isFinishedCampaign);
        require(campaigns[_hash].donationContract == 0x0);

        address newContract = RefundCharityFabricInterface(refundCharityFabric).create(
            campaigns[_hash].wallets,
            campaigns[_hash].amounts,
            campaigns[_hash].endDate
        );

        campaigns[_hash].donationContract = newContract;

        CreateDonationContract(msg.sender, _hash, newContract);

        return newContract;
    }

    function generateHash(
        address[] _wallets
    )
    internal
    returns (bytes32)
    {
        return keccak256(_wallets, block.coinbase, block.number, block.timestamp);
    }
}
