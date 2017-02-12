require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

// 获取照片数据，并进行url预处理
let imageDatas = require('json!../data/imageDatas.json');
imageDatas = (function(imageDatasArr){
	for(var i = 0, len = imageDatasArr.length; i < len; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

// 获取区间随机值
function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

// 获取0-30°的正负旋转值
function get30RandomDeg() {
	return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30);
}

// 照片组件
class ImgFigure extends React.Component {
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}

	//点击处理函数
	handleClick(e) {
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		var styleObj = {};

		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate) {
			(['WebkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform']).forEach(function(value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		if(this.props.arrange.isCenter) {
			styleObj['zIndex'] = 11;
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.fileName}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
				<div className="img-back" onClick={this.handleClick}>
					<p>{this.props.data.desc}</p>
				</div>
			</figure>
		);
	}
}

// 控制条组件
class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className="controller-unit"></span>
		);
	}
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    // 画廊舞台分区位置初始化
    this.Constant = {
	  	centerPos: {  //中心图片位置点
	  		left: 0,
	  		top: 0
	  	},
	  	hPosRange: {  // 水平方向左右分区取值范围
	  		leftSecX: [0, 0],  // 左分区
	  		rightSecX: [0, 0],  // 右分区
	  		y: [0, 0]
	  	},
	  	vPosRange: {  // 垂直方向上分区的取值范围
	  		x: [0, 0],
	  		topY: [0, 0]
	  	}
    };

    this.state = {
    	imgsArrangeArr: [
    		// {
    		// 	pos: {
    		// 		left: '0',
    		// 		top: '0'
    		// 	},
    		// 	rotate: 0,
    		// 	isInverse: false,
    		// 	isCenter: false
    		// }
    	]
    }
  }

  /**
   * 居中图片
   * @param {num} index 需居中的图片
   * @return {Function}
   */
  center(index) {
  	return function() {
  		this.rearrange(index);
  	}.bind(this);
  }

  /**
   * 翻转图片
   * @param index, 需执行翻转的图片index
   * @return {Function}
   */
  inverse(index) {
  	return function() {
  		var imgsArrangeArr = this.state.imgsArrangeArr;
  		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

  		this.setState({
  			imgsArrangeArr: imgsArrangeArr
  		});

  	}.bind(this);
  }

  // 重新布局所有图片
  rearrange(centerIndex) {
  	var imgsArrangeArr = this.state.imgsArrangeArr,
  		Constant = this.Constant,
  		centerPos = Constant.centerPos,
  		hPosRange = Constant.hPosRange,
  		vPosRange = Constant.vPosRange,
  		hPosRangeLeftSecX = hPosRange.leftSecX,
  		hPosRangeRightSecX = hPosRange.rightSecX,
  		hPosRangeY = hPosRange.y,
  		vPosRangeTopY = vPosRange.topY,
  		vPosRangeX = vPosRange.x;

  	// 上分区图片, 0或1个
  	var imgsArrangeTopArr = [],
  		topImgNum = Math.floor(Math.random() * 2),
  		topImgSpliceIndex = 0;

  	// 居中图片的处理
  	var	imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
  	imgsArrangeCenterArr[0] = {
  		pos: centerPos,
  		rotate: 0,
  		isCenter: true
  	}

  	//上分区图片的处理
  	topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
  	imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

  	imgsArrangeTopArr.forEach(function(value, index) {
  		imgsArrangeTopArr[index] = {
  			pos: {
	  			left: getRandomNum(vPosRangeX[0], vPosRangeX[1]),
	  			top: getRandomNum(vPosRangeTopY[0], vPosRangeTopY[1])
	  		},
	  		rotate: get30RandomDeg(),
	  		isCenter: false
  		}
  	});

  	//左右分区图片的处理
  	for(var i = 0, len = imgsArrangeArr.length, mid = len / 2; i < len; i ++) {
  		var hPosRangeLORX = null;

  		if(i < mid) {
  			hPosRangeLORX = hPosRangeLeftSecX;
  		} else {
  			hPosRangeLORX = hPosRangeRightSecX;
  		}

  		imgsArrangeArr[i] = {
  			pos: {
	  			left: getRandomNum(hPosRangeLORX[0], hPosRangeLORX[1]),
	  			top: getRandomNum(hPosRangeY[0], hPosRangeY[1])
	  		},
	  		rotate: get30RandomDeg(),
	  		isCenter: false
  		}
  	}
  	

  	// 将之前取出的图片信息插回原序列
  	if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
  		imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
  	}
	imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

  	this.setState({
  		imgsArrangeArr : imgsArrangeArr
  	});
  }

  // 组件加载完成后，为每张图片计算相应位置
  componentDidMount() {
  	//获取舞台大小
  	var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
  	  	stageW = stageDOM.scrollWidth,
  	  	stageH = stageDOM.scrollHeight,
  	  	halfStageW = Math.floor(stageW / 2),
  	  	halfStageH = Math.floor(stageH / 2);

    //获取imgFigure大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFgure0),
    	imgW = imgFigureDOM.scrollWidth,
    	imgH = imgFigureDOM.scrollHeight,
    	halfImgW = Math.floor(imgW / 2),
    	halfImgH = Math.floor(imgH / 2);

    //计算中心图片位置
    this.Constant.centerPos.left = halfStageW - halfImgW;
    this.Constant.centerPos.top = halfStageH - halfImgH;

    //计算左右分区位置范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    
    //计算上分区位置范围
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.rearrange(0);
  }

  render() {

  	var imgFigures =[],
  		controllerUnits = [];

  	imageDatas.forEach(function(value, index) {
  		if(! this.state.imgsArrangeArr[index]) {
  			// 为每个图片初始化位置到左上角
  			this.state.imgsArrangeArr[index] = {
  				pos: {
  					left: 0,
  					top: 0
  				},
  				rotate: 0,
  				isInverse: false,
  				isCenter: false
  			};
  		}

  		imgFigures.push(<ImgFigure data={value} ref={'imgFgure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
  		controllerUnits.push(<ControllerUnit />)
  	}.bind(this));

    return (
      <section className="stage" ref="stage">
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
