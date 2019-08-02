import TICommunicationClient from 'node-ti/build/lib/ti-communication-client';
const tiClient = new TICommunicationClient('10.8.0.128', '1025');
// const tiClient = new TICommunicationClient('10.96.0.64', '1025');

export { tiClient };
