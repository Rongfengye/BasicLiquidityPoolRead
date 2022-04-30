import { Contract, providers, BigNumber } from "ethers";
import { LIQUIDITY_POOL_ADDRESS, USDC_ADDRESS, ETH_ADDRESS } from "./addresses";
import { LIQUIDITY_POOL_ABI, TOKEN_ABI } from "./abi";


// Ethereum RPC Endpoint that will be hit by providers
// Acquired from https://rpc.info/
// const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "testing"
const ETHEREUM_RPC_URL = "https://rpc.ankr.com/eth";
// console.log("The ethereum endpoint is" + ETHEREUM_RPC_URL);

// Used to get information off of the chain
// Standard json rpc provider directly from ethers.js (Flashbots)
/* Inherits from JsonRPCProvider
    Which is a popular method for interacting with Ethereum 
      - Is available in all major Ethereum node implementations
      - As well as many third-party web services
    The JsonRpcProvider connects to a JSON-RPC HTTP API using the URL
*/
const provider = new providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);
// This provider should ONLY be used when it is known the network cannot change
// An ethers Provider will execute frequent 'getNetwork' calls and network being communicated with are consistent
// In the case of a client like MetaMask, this is desired as the network may be 
//    changed by the user at any time, in such cases the cost of checking 
//    the chainID is local and therefore cheap
// However, there are also many times where it is known the network cannot change

const liquidity_pool = new Contract(LIQUIDITY_POOL_ADDRESS, LIQUIDITY_POOL_ABI, provider);

async function main() {
  console.log("Hitting the Ethereum RPC endpoint at" + ETHEREUM_RPC_URL);

  const FIRST_COIN_ADDRESS = await liquidity_pool.token0();
  const SECOND_COIN_ADDRESS = await liquidity_pool.token1();

  const firstCoin = new Contract(FIRST_COIN_ADDRESS, TOKEN_ABI, provider);
  const secondCoin = new Contract(SECOND_COIN_ADDRESS, TOKEN_ABI, provider);
  const firstCoinDecimals = await firstCoin.decimals();
  const secondCoinDecimals = await secondCoin.decimals();

  provider.on('block', async (blockNumber) => {
    console.log("On Block Number: " + blockNumber.toString())

    const reserves = await liquidity_pool.getReserves();

    const firstCoinReserve = reserves._reserve0;
    const firstCoinDivisor = BigNumber.from(10).pow(firstCoinDecimals);
    const pooledFirstToken = firstCoinReserve.div(firstCoinDivisor);

    const secondCoinReserve = reserves._reserve1;
    const secondCoinDivisor = BigNumber.from(10).pow(secondCoinDecimals);
    const pooledSecondToken = secondCoinReserve.div(secondCoinDivisor);

    console.log("The ratios are");
    console.log(pooledFirstToken.div(pooledSecondToken).toNumber());
  })
}

main();