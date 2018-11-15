import got from 'got';
import db from '../../db';

if (db.get('zuludesk') === undefined) {
    throw 'Missing Zuludesk authentication string';
}

export const importZuludeskDevices = () => {
    return new Promise(((resolve, reject) => {
        got('https://apiv6.zuludesk.com/devices', {
            headers: {
                'Authorization': 'Basic ' + db.get('zuludesk'),
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            }
        }).then(data => {
            let devices = JSON.parse(data.body).devices;
            resolve(devices.map((device: { UDID: string, class: string, name: string, groups: string[], batteryLevel: number }) => {
                return {
                    id: device.UDID,
                    type: device.class,
                    name: device.name,
                    groups: device.groups,
                    battery: device.batteryLevel
                };
            }));
        }).catch(console.error);
    }));
};