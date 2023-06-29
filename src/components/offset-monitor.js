import { waitForDOMContentLoaded } from "../utils/async-utils";

/**
 * 
 */
AFRAME.registerComponent("offset-monitor", {
  schema: {
    target: {
      type: "selector"
    },
    offset: {
      type: "vec3"
    },
    rotation: {
      type: "vec3"
    },
    pos: {
        type: "vec3"
    },
    on: {
      type: "string"
    },
    orientation: {
      default: 1 // see doc/image_orientations.gif
    },
    selfDestruct: {
      default: false
    },
    lookAt: {
      default: false
    }
  },
  init() {
    
    this.updateOffsetMonitor = this.updateOffsetMonitor.bind(this);

    waitForDOMContentLoaded().then(() => {
      if (this.data.on) {
        this.el.sceneEl.addEventListener(this.data.on, this.updateOffsetMonitor);
      } else {
        this.updateOffsetMonitor();
      }
    });
  },

  updateOffsetMonitor: (function () {
    
    const y = new THREE.Vector3(0, 1, 0);
    const z = new THREE.Vector3(0, 0, -1);
    const QUARTER_CIRCLE = Math.PI / 2;
    const offsetVector = new THREE.Vector3();
    //const offsetVector = new THREE.Vector3(0,2,0);
    const targetWorldPos = new THREE.Vector3();
    return function () {
        console.log("updateOffsetMonitor called");
      const obj = this.el.object3D;
      const target = this.data.target.object3D;
      offsetVector.copy(this.data.offset);
      target.localToWorld(offsetVector);
      //always same??
      
      if (obj.parent) {
        console.log("true1");
        obj.parent.worldToLocal(offsetVector);
      }
      //sets position
      //offsetVector.copy(new THREE.Vector3(0,0,0)); //can change worldtoLocal position to whatever vector you want
      offsetVector.copy(this.data.pos);
      obj.position.copy(offsetVector);
      
      console.log("scale1 "+obj.scale.x+" "+obj.scale.y+" "+obj.scale.z);
      obj.scale.set(2.25,2.25,2.25);
      console.log("scale2 "+obj.scale.x+" "+obj.scale.y+" "+obj.scale.z);
      console.log("getWorldQuaternion pos "+offsetVector.x+" "+offsetVector.y+" "+offsetVector.z);

      if (this.data.lookAt) {
        console.log("true2");
        target.getWorldPosition(targetWorldPos);
        obj.updateMatrices(true);
        obj.lookAt(targetWorldPos);
      } else {
        //sets rotation
        console.log("true3");
        obj.quaternion.setFromEuler(this.data.rotation);
      }
      //target always same, obj differs
      console.log("getWorldQuaternion pos "+obj.position.x+" "+obj.position.y+" "+obj.position.z);

      // See doc/image_orientations.gif
      switch (this.data.orientation) {
        case 8:
          obj.rotateOnAxis(z, 3 * QUARTER_CIRCLE);
          break;
        case 7:
          obj.rotateOnAxis(z, 3 * QUARTER_CIRCLE);
          obj.rotateOnAxis(y, 2 * QUARTER_CIRCLE);
          break;
        case 6:
          obj.rotateOnAxis(z, QUARTER_CIRCLE);
          break;
        case 5:
          obj.rotateOnAxis(z, QUARTER_CIRCLE);
          obj.rotateOnAxis(y, 2 * QUARTER_CIRCLE);
          break;
        case 4:
          obj.rotateOnAxis(z, 2 * QUARTER_CIRCLE);
          obj.rotateOnAxis(y, 2 * QUARTER_CIRCLE);
          break;
        case 3:
          obj.rotateOnAxis(z, 2 * QUARTER_CIRCLE);
          break;
        case 2:
          obj.rotateOnAxis(y, 2 * QUARTER_CIRCLE);
          break;
        case 1:
        default:
          break;
      }

      obj.matrixNeedsUpdate = true;

      if (this.data.selfDestruct) {
        if (this.data.on) {
          this.el.sceneEl.removeEventListener(this.data.on, this.updateOffsetMonitor);
        }
        this.el.removeAttribute("offset-monitor");
      }
    };
  })()
});
