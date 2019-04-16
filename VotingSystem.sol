pragma solidity >=0.5.1;

contract VotingSystem {
    
    struct Vote {
        string username;
        string rhash;
        string option;
        string salt;
    }
    
    mapping (string => bool) voted;
    mapping (string => string)  namepwd;
    uint public voteCount = 0;
    address admin;
    mapping (string => Vote) votes;
    mapping(uint => string) public votekeys;
    mapping(uint => string) public ivs;
    bool public open = true;
    constructor() public {
        admin = msg.sender;
    }
    function castVote(string memory username, string memory password, string memory rhash, string memory option, string memory salt, string memory iv) public returns (uint) {
        require(voted[username] == false && open);
        voted[username] == true;
        namepwd[username] = password;
        Vote memory myvote;
        myvote.username = username;
        myvote.rhash = rhash;
        myvote.option = option;
        myvote.salt = salt;
        votes[rhash] = myvote;
        votekeys[voteCount] = rhash;
        voteCount = voteCount + 1;
        ivs[voteCount] = iv;
        return 1245;
    }
    
    function closePoll() public returns (uint) {
        if (admin==msg.sender) {
            open = false;
            return 123;
        } else {
            return 456;
        }
    }
    
    function hasVoted(string memory who) public view returns (bool) {
        return voted[who];
    }
    
    function credentials(string memory who) public view returns (string memory ) {
        return namepwd[who];
    }
    function voteKeyof(uint who) public view returns (string memory) {
        return votekeys[who];
    }
    function ivOf(uint who) public view returns (string memory) {
        return ivs[who];
    }
}