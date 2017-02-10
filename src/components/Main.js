require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取照片数据，并进行url预处理
var imageDatas = require('../data/imageDatas.json');
imageDatas = (function(imageDatasArr){
	for(var i = 0, len = imageDatasArr.length; i < len; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

//  <img src={imageDatas[1].imageURL} alt="Yeoman Generator" />

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
