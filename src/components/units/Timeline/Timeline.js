import React  from 'react';
import Data from './Data';
import TimelineItem from './TimelineItem';

const Timeline = () => Data.length > 0 && (
        <div className="timeline-container">
            <div className='timeline-container2'></div>
            {Data.map((data, idx) => (
                <TimelineItem data={data} key={idx} />
            ))}
        </div>
    );

export default Timeline;