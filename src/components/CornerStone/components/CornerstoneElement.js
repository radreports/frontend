import React from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneWebImageLoader from "@flamy-dev/cornerstone-web-image-loader";
import * as dicomParser from "dicom-parser";

function getBlobUrl(url) {
  const baseUrl = window.URL || window.webkitURL;
  const blob = new Blob([`importScripts('${url}')`], {
    type: "application/javascript"
  });

  return baseUrl.createObjectURL(blob);
}

let webWorkerUrl = getBlobUrl(
  "https://unpkg.com/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderWebWorker.min.js"
);
let codecsUrl = getBlobUrl(
  "https://unpkg.com/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderCodecs.js"
);

const config = {
  webWorkerPath: webWorkerUrl,
  taskConfiguration: {
    decodeTask: {
      codecsPath: codecsUrl
    }
  }
};

class CornerstoneElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stack: props.stack,
      viewport: cornerstone.getDefaultViewport(null, undefined),
      imageId: props.stack.imageIds[0]
    };
    this.element = React.createRef();
  }

  render() {
    return (
      <div className="w-full">
        <div
          className="viewportElement relative text-white h-full w-full"
          // style={this.props.style}
          ref={(input) => {
            this.element = input;
          }}
          onContextMenu={(e) => e.preventDefault()}
          {...this.props.rest}
        >
          <canvas
            // style={this.props.style}
            className="cornerstone-canvas absolute top-0 left-0"
          />
        </div>

        {/* <div className="col-span-3">
          {options.map((ele, idx) => {
            return (
              <Button
                className="mb-2 mr-1"
                key={`${idx}-${ele.label}`}
                onClick={ele.handleClick}
              >
                {ele.label}
              </Button>
            );
          })}
          <Button
            className="mt-6 bg-blue-500"
            style={{ color: "white" }}
            onClick={() => this.props.onClickToSendFile()}
          >
            Predict
          </Button>
        </div> */}
      </div>
    );
  }

  componentDidMount() {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;

    cornerstoneWADOImageLoader.configure({
      beforeSend: function (xhr) {
        // Add custom headers here (e.g. auth tokens)
        //xhr.setRequestHeader('x-auth-token', 'my auth token');
      },
      useWebWorkers: true
    });

    cornerstoneTools.init();

    const element = this.element;
    cornerstone.enable(element);
    this.loadLocalImage(this.props.stack.imageIds[0]);

    const WwwcTool = cornerstoneTools.WwwcTool;
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
    const PanTool = cornerstoneTools.PanTool;
    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
    cornerstoneTools.setToolActive("ZoomMouseWheel", {
      mouseButtonMask: 1
    });
    cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 2 });
    window.addEventListener("resize", this.onWindowResize);
  }

  componentWillUnmount() {
    const element = this.element;
    window.removeEventListener("resize", this.onWindowResize);

    cornerstone.disable(element);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.stack.imageIds !== this.props.stack.imageIds) {
      this.setState({
        imageId: this.props.stack.imageIds[0]
      });
      this.loadLocalImage(this.props.stack.imageIds[0]);
    }
  }

  loadLocalImage(file) {
    let newImageId = null;
    if (file.type.toLowerCase().startsWith("image")) {
      newImageId = URL.createObjectURL(file);
    } else {
      newImageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    }
    this.loadAndViewImage(newImageId);
  }

  handleSize256 = () => {
    // this.element.style.width = "256px";
    // this.element.style.height = "256px";
    // cornerstone.resize(this.element);

    const viewport = cornerstone.getViewport(this.element);
    viewport.scale = 2.0;
    cornerstone.setViewport(this.element, viewport);
  };

  handleSize512 = () => {
    this.element.style.width = "512px";
    this.element.style.height = "512px";
    cornerstone.resize(this.element);
  };

  onWindowResize = () => {
    cornerstone.resize(this.element);
  };

  loadAndViewImage = (imageId) => {
    const element = this.element;
    cornerstone.loadImage(imageId).then(
      function (image) {
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);
      },
      function (err) {
        console.log("My error ----???");
        console.log(err);
      }
    );
  };
}

export default CornerstoneElement;
