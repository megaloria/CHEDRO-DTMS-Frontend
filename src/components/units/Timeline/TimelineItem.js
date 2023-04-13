import React  from 'react';

const TimelineItem = ({ data }) => (
    <div className="timeline-item" {...data}>
        <div className="timeline-item-content" style={{ }}>
            <div>
                <span className="tag" style={{ background: data.category?.color }}>
                    {data.category?.tag}
                </span>
                <time>{data.date}</time>
                <p>{data.text}</p>
                
            </div>
            <span className="circle" style={data.circleStyle}/>
                {/* , backgroundColor: data.circleColor  */}
        </div>
    </div>
);

export default TimelineItem;

