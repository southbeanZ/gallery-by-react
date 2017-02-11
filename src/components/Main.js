require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取照片数据，并进行url预处理
let imageDatas = require('json!../data/imageDatas.json');
imageDatas = (function(imageDatasArr){
	for(var i = 0, len = imageDatasArr.length; i < len; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

//照片组件
class ImgFigure extends React.Component {
	render() {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL} alt={this.props.data.fileName}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

class AppComponent extends React.Component {
  render() {

  	var imgFigures =[],
  		controllerUnits = [];

  	imageDatas.forEach(function(value) {
  		imgFigures.push(<ImgFigure data={value}/>);
  	});

    return (
      <section className="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
