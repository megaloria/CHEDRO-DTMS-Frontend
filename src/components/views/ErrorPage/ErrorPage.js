import React from 'react';
import img from '../../../assets/404.png';

function ErrorPage() {
  return (
		<div style={{ marginTop: '10%', textAlign: 'center' }}>
			<div>
				<img style={{ width: '500px', height: 'auto' }} src={img} alt='404' />
			</div>

			<div style={{ marginTop:'2%' }}>
				<h1 style={{ fontSize: '90px' }}> <b> Oops!</b> </h1>
				<h3> Sorry Page Not Found </h3>
				<h5> The link you clicked may be broken or the page may have been removed. </h5>
			</div> 
		</div>
  );
}

export default ErrorPage;

