import React from 'react';
import img from '../../../assets/404.png';
import './style.css';
import {
	Row,

} from 'react-bootstrap';

function ErrorPage() {
	return (
		<div style={{ marginTop: '10%', textAlign: 'center', padding: '0px 10px' }}>
			<Row className='justify-content-center mt-5'>
				<img style={{ width: '500px', height: 'auto' }} src={img} alt='404' />
			</Row>

			<Row className='mt-2'>
				<h1 className='Oops' style={{ fontSize: '90px' }}> <b> Oops!</b> </h1>
				<h3> Page Not Found </h3>
				<h5> The link you clicked may be broken or the page may have been removed. </h5>
				<h5> Try to <span className='refresh' onClick={() => window.location.reload(true)}>refresh</span> the page. </h5>
			</Row>
		</div>
	);
}

export default ErrorPage;

