const os = require('os');
let Host = null;
const network = os.networkInterfaces();

try {
  // 遍历网络接口信息，找到第一个非localhost的IPv4地址
  for (const key in network) {
    if (!Host) {
      for (const details of network[key]) {
        if (details.family === 'IPv4' && !details.internal) {
          Host = details.address;
          break;
        }
      }
    }
  }
} catch (err) {
  console.error(err);
  throw new Error("Failed to get host IP address.");
}

// 如果没有找到非localhost的IPv4地址，默认使用localhost
if (!Host) {
  Host = 'localhost';
}

module.exports = {
  Host,
  network,
};

//WLAN 有两个对象,一个是ip6,一个是ip4,不过我们一般都是使用ip4
/**
 * WLAN: [
 *  {
 *    address: 'fe80::b40d:8e63:9214:8e7d',
 *    netmask: 'ffff:ffff:ffff:ffff::',
 *    family: 'IPv6',
 *    mac: '30:c9:ab:a8:e2:13',
 *    internal: false,
 *    cidr: 'fe80::b40d:8e63:9214:8e7d/64',
 *    scopeid: 6
 *  },
 *  {
 *    address: '192.168.0.108',
 *    netmask: '255.255.255.0',
 *    family: 'IPv4',
 *    mac: '30:c9:ab:a8:e2:13',
 *    internal: false,
 *    cidr: '192.168.0.108/24'
 *  }
 */