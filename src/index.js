"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ETHER = void 0;
var ethers_1 = require("ethers");
var addresses_1 = require("./addresses");
var abi_1 = require("./abi");
// Ethereum RPC Endpoint that will be hit by providers
// Acquired from https://rpc.info/
// const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "testing"
var ETHEREUM_RPC_URL = "https://rpc.ankr.com/eth";
// console.log("The ethereum endpoint is" + ETHEREUM_RPC_URL);
// Used to get information off of the chain
// Standard json rpc provider directly from ethers.js (Flashbots)
/* Inherits from JsonRPCProvider
    Which is a popular method for interacting with Ethereum
      - Is available in all major Ethereum node implementations
      - As well as many third-party web services
    The JsonRpcProvider connects to a JSON-RPC HTTP API using the URL
*/
var provider = new ethers_1.providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);
// This provider should ONLY be used when it is known the network cannot change
// An ethers Provider will execute frequent 'getNetwork' calls and network being communicated with are consistent
// In the case of a client like MetaMask, this is desired as the network may be 
//    changed by the user at any time, in such cases the cost of checking 
//    the chainID is local and therefore cheap
// However, there are also many times where it is known the network cannot change
var liquidity_pool = new ethers_1.Contract(addresses_1.LIQUIDITY_POOL_ADDRESS, abi_1.LIQUIDITY_POOL_ABI, provider);
exports.ETHER = ethers_1.BigNumber.from(10).pow(18);
// BigNumber is a library in ethers that helps handle really large numbers and prevent overflow
function bigNumberToDecimal(value, base) {
    if (base === void 0) { base = 18; }
    var divisor = ethers_1.BigNumber.from(10).pow(base);
    return value.mul(10000).div(divisor).toNumber() / 10000;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var FIRST_COIN_ADDRESS, SECOND_COIN_ADDRESS, firstCoin, secondCoin, firstCoinDecimals, secondCoinDecimals;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Hitting the Ethereum RPC endpoint at" + ETHEREUM_RPC_URL);
                    return [4 /*yield*/, liquidity_pool.token0()];
                case 1:
                    FIRST_COIN_ADDRESS = _a.sent();
                    return [4 /*yield*/, liquidity_pool.token1()];
                case 2:
                    SECOND_COIN_ADDRESS = _a.sent();
                    firstCoin = new ethers_1.Contract(FIRST_COIN_ADDRESS, abi_1.TOKEN_ABI, provider);
                    secondCoin = new ethers_1.Contract(SECOND_COIN_ADDRESS, abi_1.TOKEN_ABI, provider);
                    return [4 /*yield*/, firstCoin.decimals()];
                case 3:
                    firstCoinDecimals = _a.sent();
                    return [4 /*yield*/, secondCoin.decimals()];
                case 4:
                    secondCoinDecimals = _a.sent();
                    provider.on('block', function (blockNumber) { return __awaiter(_this, void 0, void 0, function () {
                        var reserves, firstCoinReserve, firstCoinDivisor, pooledFirstToken, secondCoinReserve, secondCoinDivisor, pooledSecondToken;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("On Block Number: " + blockNumber.toString());
                                    return [4 /*yield*/, liquidity_pool.getReserves()];
                                case 1:
                                    reserves = _a.sent();
                                    console.log("The reserves for this pool");
                                    console.log(reserves);
                                    firstCoinReserve = reserves._reserve0;
                                    firstCoinDivisor = ethers_1.BigNumber.from(10).pow(firstCoinDecimals);
                                    pooledFirstToken = firstCoinReserve.div(firstCoinDivisor);
                                    secondCoinReserve = reserves._reserve1;
                                    secondCoinDivisor = ethers_1.BigNumber.from(10).pow(secondCoinDecimals);
                                    pooledSecondToken = secondCoinReserve.div(secondCoinDivisor);
                                    console.log("The ratios are");
                                    console.log(pooledFirstToken.div(pooledSecondToken).toNumber());
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
main();
