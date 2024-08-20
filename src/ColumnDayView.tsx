import { createPlugin, Duration } from '@fullcalendar/core';
import { DateProfile, EventInstance, ViewProps } from '@fullcalendar/core/internal';
import moment, { Moment } from 'moment';
import './ColumnDayView.scss';
import { Fragment } from 'react';


export interface ColumnDayEvents {
    onCompanyColumnDrag: (start: Date | string, end: Date | string) => void
    onCompanyEventClick: (event: EventInstance) => void
    onFreelancerEventClick: (event: EventInstance) => void
}

//TODO: combine with business hours from fullcalendar, received in props
const defaultBusinessHours = {
    // days of week. an array of zero-based day of week integers (0=Sunday)
    daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday

    startTime: '8:00', // a start time (10am in this example)
    endTime: '20:00', // an end time (6pm in this example)
}

//TODO: i18n support
function weekFrom(date?: Date) {
    const start = moment(date || Date.now()).startOf('week');
    return Array.from(Array(7), (_, i) => start.clone().add(i, 'day'))
}

function isCurrentDate(date: Moment) {
    return date.isSame(moment.now(), 'date')
}

function hoursFrom(startTime: string, endTime: string, slotIntervalMinutes: number) {
    const start = moment(startTime, 'k:mm')
    const end = moment(endTime, 'k:mm')
    const hours = [start]
    let current = start.clone()
    while (current.isBefore(end)) {
        current = current.clone().add(slotIntervalMinutes, 'minutes')
        hours.push(current)
    }
    return hours
}

function toFullDate(date: Moment, hour: Moment) {
    return moment(`${date.format('YYYY-MM-DD')} ${hour.format('HH:mm')}`, 'YYYY-MM-DD HH:mm')
}

function ColumnDayView(props: ViewProps & { dateProfile: DateProfile, nextDayThreshold: Duration, callbacks: ColumnDayEvents }) {
    const week = weekFrom(props.dateProfile?.activeRange?.start)

    let startDrag: Moment | undefined = undefined
    let endDrag: Moment | undefined = undefined

    const cellDragStartHandler = (day: Moment, hour: Moment) => {
        startDrag = toFullDate(day, hour)
    }

    const cellDragOverHandler = (event: any, day: Moment, hour: Moment) => {
        event.preventDefault()
        event.target.classList.add("selected-col")
        endDrag = toFullDate(day, hour)
    }

    const cellDragEndHandler = () => {
        if (!startDrag || !endDrag || !endDrag.isSame(startDrag, 'day')) {
            return
        }
        props.callbacks.onCompanyColumnDrag(startDrag.toDate(), endDrag.toDate())
        document.querySelectorAll(".selected-col").forEach(el => el.classList.remove("selected-col"))
        startDrag = undefined
        endDrag = undefined
    }

    const getEvent = (type: 'company' | 'freelancer', day: Moment, hour: Moment) => {
        const cellDate = toFullDate(day, hour)
        return Object.values(props.eventStore.instances).find(s =>
            props.eventStore.defs[s.defId].extendedProps.type === type
            && moment(s.range.start).isSameOrBefore(cellDate, 'minute')
            && moment(s.range.end).isSameOrAfter(cellDate, 'minute')
        )
    }

    const hasEvent = (type: 'company' | 'freelancer', day: Moment, hour: Moment) => {
        return !!getEvent(type, day, hour)
    }

    const cellClickHandler = (type: 'company' | 'freelancer', day: Moment, hour: Moment) => {
        const event = getEvent(type, day, hour);
        if (!event) {
            return
        }
        switch (type) {
            case 'company':
                props.callbacks.onCompanyEventClick(event)
                break
            case 'freelancer':
                props.callbacks.onFreelancerEventClick(event)
                break
        }
    }

    return (
        <table role="presentation" className='column-day-table'>
            <thead role="presentation">
                <tr role="row">
                    <th aria-hidden="true" className='time-col'></th>
                    {week.map((day, i) =>
                        <th
                            className={`day-col ${isCurrentDate(day) ? 'current-date' : ''}`}
                            colSpan={3}
                            key={`cal-head-${i}`}>
                            {day.format('dddd DD/MM')}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody role="presentation">
                {hoursFrom(defaultBusinessHours.startTime, defaultBusinessHours.endTime, 30).map((hour, i) =>
                    <tr key={`hour-slot-${i}`} role="presentation">
                        <td className="time-display">{hour.format('kk:mm')}</td>
                        {week.map((day, i) => <Fragment key={`cal-cell-${i}`}>
                            <td draggable
                                className='editable-col'
                                onDragStart={_ => cellDragStartHandler(day, hour)}
                                onDragOver={evt => cellDragOverHandler(evt, day, hour)}
                                onDragEnd={cellDragEndHandler}
                                onClick={_ => cellClickHandler('company', day, hour)}
                            >
                                {
                                    hasEvent('company', day, hour) && <div className="cell-event-company"></div>
                                }
                            </td>
                            <td className='span-col'></td>
                            <td
                                onClick={_ => cellClickHandler('freelancer', day, hour)}
                            >
                            </td>
                        </Fragment>)}
                    </tr>
                )}
            </tbody>
        </table>
    );
}


//https://stackoverflow.com/questions/66104254/accessing-context-from-a-custom-view
export default function createColumnDayView(callbacks: ColumnDayEvents) {
    class MorePropsToView {
        transform(viewProps: ViewProps) {
            return {
                ...viewProps,
                callbacks
            }
        }
    }

    return createPlugin({
        views: {
            columnDayView: ColumnDayView as any,
        },
        name: 'columnDayView',
        viewPropsTransformers: [MorePropsToView]
    })
}