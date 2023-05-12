import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React  from 'react';
import {
  Button,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

const TimelineItem = ({ data }) => (
    <div className="timeline-item" {...data}>
        <div className="timeline-item-content" >
              <div style={{textAlign:'right', width:'100%', marginTop:'-5px', marginRight:'-10px'}}>
                <span className="tag d-none d-md-inline-block" >
                    {data.category?.tag}
                </span> 

                {['bottom'].map((placement) => (
                <OverlayTrigger
                    key={placement}
                    trigger={['click', 'hover']}
                    placement={placement}
                    overlay={
                        <Tooltip id={`tooltip-${placement}`}>
                            {data.category?.tag}
                        </Tooltip>
                    }
                    >
                    <span className='d-inline-block d-md-none' >
                        <Button variant="outline-warning" size='sm' style={{marginRight:'-9.5px'}}>
                            <FontAwesomeIcon icon={faUserCheck} className=""/> 
                        </Button>
                    </span>
                </OverlayTrigger>
                ))}
             </div> 
            
            <div>
                <time>{data.date}</time>    
                <p>{data.text}</p>   
            </div>
         
             
            <span className="circle" style={data.circleStyle}/>
                {/* , backgroundColor: data.circleColor  */}
        </div>
    </div>
);

export default TimelineItem;

