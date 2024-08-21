import moment, { Moment } from 'moment';


const dummyEvents = [
    {
        id: '1',
        type: 'company',
        start: moment().startOf('week').add(1, 'day').hour(9).minute(0),
        end: moment().startOf('week').add(1, 'day').hour(12).minute(0)
    },
    {
        id: '2',
        type: 'company',
        start: moment().startOf('week').add(2, 'day').hour(10).minute(0),
        end: moment().startOf('week').add(2, 'day').hour(11).minute(30)
    },
    {
        id: '3',
        type: 'freelancer',
        start: moment().startOf('week').add(3, 'day').hour(13).minute(0),
        end: moment().startOf('week').add(3, 'day').hour(15).minute(0)
    },
    {
        id: '4',
        type: 'freelancer',
        start: moment().startOf('week').add(4, 'day').hour(9).minute(0),
        end: moment().startOf('week').add(4, 'day').hour(10).minute(0)
    }
];

 export default dummyEvents;