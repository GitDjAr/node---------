const os = require('os')
let Host = null;
const network = os.networkInterfaces()
try {
  for (const key in network) {
    if (!Host) {
      Host = network[key][1].address
    }
  }
} catch (err) {
  // console.log(err);
  throw Error(err)
}
module.exports = {
  Host,
  network
}
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