import React from 'react';
import TimelineItem from './TimelineItem';
import './styles.css'

const Timeline = ({ data }) =>
    data.length > 0 && (
        <div className="timeline-container">
            <div className="timeline-container2"></div>
            {data.map((data, idx) => (
                <TimelineItem data={data} key={idx} />
            ))}
        </div>
    );

export default Timeline;