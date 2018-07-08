pragma solidity ^0.4.21;

import "./ERC20Interface.sol";

// Owned contract
contract Owned {
    address public owner;
    address public newOwner;
    event OwnershipTransferred(address indexed _from, address indexed _to);

    function Owned() public {
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    //Transfer owner rights, can use only owner (the best practice of secure for the contracts)
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }

    //Accept tranfer owner rights
    function acceptOwnership() public onlyOwner {
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
	// to brder roles from contract of transactions
    mapping(address => mapping(string => bool)) roles;

    function RoleBasedAcl () {
    	owner = msg.sender;
    }

    function assignRole (address entity, string role) hasRole('taker') {
	roles[entity][role] = true;
    }

    function unassignRole (address entity, string role) hasRole('taker') {
	roles[entity][role] = false;
    }

    function isAssignedRole (address entity, string role) returns (bool) {
    	return roles[entity][role];
    }

    modifier hasRole (string role) {
	if (!roles[msg.sender][role] && msg.sender != owner) {
	      throw;
	}
   	_;
    }
}

contract Rainbow is ERC20Interface, Owned {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    string public name;
    uint8 public decimals;
    string public symbol;
    address private fundsWallet;
    uint256 _initialAmount;
    string _tokenName;
    uint8 _decimalUnits;
    string _tokenSymbol;


    function ERC20() public {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        // totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
    }

    function RAW() public {
        symbol = 'RAW';
        name = 'RAINBOW';
        decimals = 20;
        _initialAmount = 10000000;
        balances[owner] = _initialAmount;
        Transfer(address(0), owner, _initialAmount);
        fundsWallet = msg.sender;
    }

    function totalSupply() public constant returns (uint) {
        return _initialAmount  - balances[address(0)];
    }

    //function balanceOf(address tokenOwner) public constant returns (uint balance) {
    //    return balances[tokenOwner];
    //}

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}
