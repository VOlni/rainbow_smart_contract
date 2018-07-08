const { assertRevert } = require('../helpers/assertRevert');

const ERC20Abstraction = artifacts.require('./RAW.sol');
let Request;

contract('RAW', (accounts) => {
  beforeEach(async () => {
    Request = await ERC20Abstraction.new(10000, 'Joh Cena', 1, 'ETH', { from: accounts[0] });
  });

  it('This should create an initial balance of 1000000 for the creator', async () => {
    const balance = await Request.balanceOf.call(accounts[0]);
    assert.strictEqual(balance.toNumber(), 1000000);
  });

  let ownerAddress = accounts[0];

  it('Has an owner', async function () {
      assert.equal(await Request.owner(), ownerAddress)
  });

  it('This should show info about the owner', async () => {
    const name = await Request.name.call();
    assert.strictEqual(name, 'Joe Cocker');

    const decimals = await Request.decimals.call();
    assert.strictEqual(decimals.toNumber(), 1);

    const symbol = await Request.symbol.call();
    assert.strictEqual(symbol, 'ETH');
  });

  // TRANSFERS OF COINS
  it('This shows that transfer should be reversed', async () => {
    const balanceBefore = await Request.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceBefore.toNumber(), 10000);

    await assertRevert(new Promise((resolve, reject) => {
      web3.eth.sendTransaction({ from: accounts[0], to: Request.address, value: web3.toWei('20', 'ETH') }, (err, res) => {
        if (err) { reject(err); }
        resolve(res);
      });
    }));

    const balanceAfter = await Request.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceAfter.toNumber(), 10000);
  });

    it(`This should put 1000000 ETH tokens in the owner account`, async () => {
        let balance = await Request.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), getValidTokenNumbers(1000000));
    });

    it(`This sends 50000 tokens to the recipient and verify his balance`, async function () {
        await Request.sendTokens(accounts[1], getValidTokenNumbers(50000));
        let balanceReceived = await Request.balanceOf.call(accounts[1]);
        assert.equal(balanceReceived.valueOf(), getValidTokenNumbers(50000))
    });

    it(`This transfer main rights for contract from the owner to the taker`, async function () {
        await Request.transferOwnership(accounts[1]);
        let newOwner = await Request.newOwner();
        assert.equal(newOwner, accounts[1])
    });

    it(`This approves the rights of the new owner`, async function () {
        await Request.acceptOwnership();
        newOwner = await Request.owner();
        assert.equal(newOwner, accounts[1]);
    });

  // APPROVALS
  it('This should approve that msg.sender should approve 100 to accounts[1]', async () => {
    await Request.approve(accounts[1], 100, { from: accounts[0] });
    const allowance = await Request.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance.toNumber(), 100);
  });

  it('This should approve that withdrawal from account isnt allowed (should fail)', async () => {
    await assertRevert(Request.transferFrom.call(accounts[0], accounts[2], 60, { from: accounts[1] }));
  });

  it('This should approve that its possible to allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.', async () => {
    await Request.approve(accounts[1], 100, { from: accounts[0] });
    await Request.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] });
    await Request.approve(accounts[1], 0, { from: accounts[0] });
    await assertRevert(Request.transferFrom.call(accounts[0], accounts[2], 10, { from: accounts[1] }));
  });

  it('This should approve (2^256 - 1)', async () => {
    await Request.approve(accounts[1], '115792089237316195423570985008687907853269984665640564039457584007913129639935', { from: accounts[0] });
    const allowance = await Request.allowance(accounts[0], accounts[1]);
    assert(allowance.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77'));
  });


});
