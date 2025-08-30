import GUI from "lil-gui";

export default class GuiController {
  // constructor() {
  //   this.gui = new GUI()
  //   this.folders = {}
  // }

  constructor(guiInstance = null) {
    this.gui = guiInstance || new GUI();
    this.folders = {};
  }

  add(...args) {
    return this.gui.add(...args);
  }

  addObjectControls(name, object) {
    const folder = this.gui.addFolder(name);

    // Position
    folder.add(object.position, "x", -3000, 3000).step(0.1).name("pos.x");
    folder.add(object.position, "y", -3000, 3000).step(0.1).name("pos.y");
    folder.add(object.position, "z", -3000, 3000).step(0.1).name("pos.z");

    // Scale
    folder.add(object.scale, "x", 0.01, 5).step(0.01).name("scale.x");
    folder.add(object.scale, "y", 0.01, 5).step(0.01).name("scale.y");
    folder.add(object.scale, "z", 0.01, 5).step(0.01).name("scale.z");

    // Rotation
    folder
      .add(object.rotation, "x", 0, Math.PI * 2)
      .step(0.01)
      .name("rot.x");
    folder
      .add(object.rotation, "y", 0, Math.PI * 2)
      .step(0.01)
      .name("rot.y");
    folder
      .add(object.rotation, "z", 0, Math.PI * 2)
      .step(0.01)
      .name("rot.z");

    folder.open();

    this.folders[name] = folder;
  }


  addLaunchStopControls(rocket) {
    this.gui.add({ launch: () => rocket.launch() }, "launch").name("🚀 Launch");
    this.gui.add({ stop: () => rocket.stop() }, "stop").name("⏸️ Stop");
  }

  addTextMonitor(label, getValue) {
    const obj = { [label]: getValue() };

    const controller = this.gui.add(obj, label);

    function update() {
      controller.setValue(getValue());
      requestAnimationFrame(update);
    }

    update();
  }

  addVector3Monitor(label, getVectorFunc) {
    const vector = { x: 0, y: 0, z: 0 };

    const folder = this.gui.addFolder(label);

    folder.add(vector, "x").name("X").listen();
    folder.add(vector, "y").name("Y").listen();
    folder.add(vector, "z").name("Z").listen();

    function update() {
      const v = getVectorFunc();
      vector.x = v[0]?.toFixed(2) ?? 0;
      vector.y = v[1]?.toFixed(2) ?? 0;
      vector.z = v[2]?.toFixed(2) ?? 0;
      requestAnimationFrame(update);
    }

    update();
  }

  // // يعرض المتجه ومقداره في عنوان المجلد:
  // addVector3WithMagnitude(label, getVectorFunc) {
  //   const vector = { x: 0, y: 0, z: 0 };
  //   const folder = this.gui.addFolder(label);

  //   folder.add(vector, "x").name("X").listen();
  //   folder.add(vector, "y").name("Y").listen();
  //   folder.add(vector, "z").name("Z").listen();

  //   // اجلب عنصر عنوان المجلد لتحديثه لاحقًا
  //   const titleElement = folder.domElement.querySelector(".title");

  //   function getMagnitude(vec) {
  //     return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
  //   }

  //   function update() {
  //     const v = getVectorFunc();
  //     vector.x = v[0]?.toFixed(2) ?? 0;
  //     vector.y = v[1]?.toFixed(2) ?? 0;
  //     vector.z = v[2]?.toFixed(2) ?? 0;

  //     if (titleElement) {
  //       titleElement.textContent = `${label} F: ${getMagnitude(v).toFixed(
  //         2
  //       )} N`;
  //     }

  //     requestAnimationFrame(update);
  //   }

  //   update();
  // }

  addVector3WithMagnitude(label, getVectorFunc, unit = "") {
    const vector = { x: 0, y: 0, z: 0 };
    const folder = this.gui.addFolder(label);
    folder.close(); 
    folder.add(vector, "x").name("X").listen();
    folder.add(vector, "y").name("Y").listen();
    folder.add(vector, "z").name("Z").listen();

    const titleElement = folder.domElement.querySelector(".title");

    function getMagnitude(vec) {
      return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
    }

    function update() {
      const v = getVectorFunc();
      vector.x = v[0]?.toFixed(2) ?? 0;
      vector.y = v[1]?.toFixed(2) ?? 0;
      vector.z = v[2]?.toFixed(2) ?? 0;

      if (titleElement) {
        const magnitude = getMagnitude(v).toFixed(2);
        titleElement.innerHTML = `${label}<span style="float:right;"> ${magnitude} ${unit}</span>`;
      }

      requestAnimationFrame(update);
    }

    update();
  }

  // addVector3WithMagnitudeWithExtraMonitors({
  //   label,
  //   getVectorFunc = null,
  //   unit = "",
  //   extraMonitors = [],
  // }) {
  //   const folder = this.gui.addFolder(label);
  //   folder.close(); // إغلاق المجلد افتراضيًا

  //   const hasVector = typeof getVectorFunc === "function";

  //   // الوصول إلى عنوان المجلد لتحديثه لاحقًا
  //   const titleElement = folder.domElement.querySelector(".title");

  //   // فقط إذا تم تمرير getVectorFunc، نقوم بإنشاء vector والمتغيرات المرتبطة به
  //   let vector = null;
  //   if (hasVector) {
  //     vector = { x: 0, y: 0, z: 0 };
  //     folder.add(vector, "x").name("X").listen();
  //     folder.add(vector, "y").name("Y").listen();
  //     folder.add(vector, "z").name("Z").listen();
  //   }

  //   // القيم الإضافية داخل المجلد
  //   const extraValues = {};
  //   const controllers = [];

  //   for (const { label: extraLabel, getValue } of extraMonitors) {
  //     extraValues[extraLabel] = getValue();
  //     const ctrl = folder.add(extraValues, extraLabel).listen();
  //     controllers.push({ ctrl, getValue, label: extraLabel });
  //   }

  //   // دالة لحساب مقدار المتجه
  //   function getMagnitude(vec) {
  //     return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
  //   }

  //   // التحديث المستمر
  //   function update() {
  //     let v = [0, 0, 0];

  //     if (hasVector) {
  //       v = getVectorFunc() || [0, 0, 0];
  //       vector.x = v[0]?.toFixed(2) ?? 0;
  //       vector.y = v[1]?.toFixed(2) ?? 0;
  //       vector.z = v[2]?.toFixed(2) ?? 0;

  //       // تحديث العنوان بالمقدار
  //       if (titleElement) {
  //         const magnitude = getMagnitude(v).toFixed(2);
  //         titleElement.innerHTML = `${label}<span style="float:right;">${magnitude} ${unit}</span>`;
  //       }
  //     }

  //     // تحديث القيم الإضافية
  //     for (const { ctrl, getValue, label } of controllers) {
  //       extraValues[label] = getValue();
  //       ctrl.setValue(extraValues[label]);
  //     }

  //     requestAnimationFrame(update);
  //   }

  //   update();
  // }

  addVector3WithMagnitudeWithExtraMonitors({
    label,
    getVectorFunc = null,
    unit = "",
    extraMonitors = [],
  }) {
    const folder = this.gui.addFolder(label);
    folder.close(); // إغلاق المجلد افتراضيًا

    const hasVector = typeof getVectorFunc === "function";
    const titleElement = folder.domElement.querySelector(".title");

    // فقط إذا تم تمرير getVectorFunc، نقوم بإنشاء vector والمتغيرات المرتبطة به
    let vector = null;
    if (hasVector) {
      vector = { x: 0, y: 0, z: 0 };
      folder.add(vector, "x").name("X").listen();
      folder.add(vector, "y").name("Y").listen();
      folder.add(vector, "z").name("Z").listen();
    }

    const extraValues = {};
    const controllers = [];

    for (const { label: extraLabel, getValue } of extraMonitors) {
      extraValues[extraLabel] = getValue();
      const ctrl = folder.add(extraValues, extraLabel).listen();
      controllers.push({ ctrl, getValue, label: extraLabel });
    }

    // دالة لحساب مقدار المتجه
    function getMagnitude(vec) {
      return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
    }
    //   السهم بناءً على الاتجاه الأقوى
    function getVectorMainArrow([x, y, z], threshold = 0.01) {
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const absZ = Math.abs(z);

      if (absX < threshold && absY < threshold && absZ < threshold) return "•";

      if (absY >= absX && absY >= absZ) return y > 0 ? "↑" : "↓";
      if (absX >= absY && absX >= absZ) return x > 0 ? "→" : "←";
      return z > 0 ? "Z↑" : "Z↓";
    }
    function update() {
      let v = [0, 0, 0];

      if (hasVector) {
        v = getVectorFunc() || [0, 0, 0];
        vector.x = v[0]?.toFixed(2) ?? 0;
        vector.y = v[1]?.toFixed(2) ?? 0;
        vector.z = v[2]?.toFixed(2) ?? 0;

        const magnitude = getMagnitude(v).toFixed(2);
        const arrow = getVectorMainArrow(v);

        if (titleElement) {
          titleElement.innerHTML = `${label}<span style="float:right;">${arrow}  ${magnitude} ${unit}</span>`;
        }
      }

      for (const { ctrl, getValue, label } of controllers) {
        extraValues[label] = getValue();
        ctrl.setValue(extraValues[label]);
      }

      requestAnimationFrame(update);
    }

    update();
  }

  /**
   * إضافة شريط بصري ملون لعرض نسبة الوقود
   * @param {string} label - عنوان الشريط
   * @param {() => number} getCurrentFuelMass - دالة تعيد كتلة الوقود الحالية
   * @param {() => number} getTotalFuelMass - دالة تعيد كتلة الوقود الكلية
   */
  addFuelProgressBar(label, getCurrentFuelMass, getTotalFuelMass) {
    const folder = this.gui.addFolder(label);
    folder.open();

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "stretch";
    container.style.padding = "4px 0";

    const progressBar = document.createElement("div");
    progressBar.style.height = "20px";
    progressBar.style.border = "1px solid #ccc";
    progressBar.style.borderRadius = "4px";
    progressBar.style.overflow = "hidden";
    progressBar.style.background = "#eee";

    const progressFill = document.createElement("div");
    progressFill.style.height = "100%";
    progressFill.style.width = "0%";
    progressFill.style.transition = "width 0.3s";
    progressFill.style.background = "green";
    progressBar.appendChild(progressFill);

    const text = document.createElement("div");
    text.style.textAlign = "center";
    text.style.fontSize = "12px";
    text.style.marginTop = "4px";

    container.appendChild(progressBar);
    container.appendChild(text);

    const childrenContainer = folder.domElement.querySelector(".children");
    if (childrenContainer) {
      childrenContainer.appendChild(container);
    } else {
      folder.domElement.appendChild(container); // fallback
    }

    function getColorByRatio(ratio) {
      if (ratio > 0.6) return "#4caf50"; // أخضر
      if (ratio > 0.3) return "#ffb300"; // أصفر
      return "#f44336"; // أحمر
    }

    // تحديث مستمر
    function update() {
      const current = getCurrentFuelMass();
      const total = getTotalFuelMass();
      const ratio = total > 0 ? Math.max(0, Math.min(1, current / total)) : 0;

      progressFill.style.width = `${ratio * 100}%`;
      progressFill.style.background = getColorByRatio(ratio);
      text.textContent = `Fuel: ${current.toFixed(1)} / ${total.toFixed(
        1
      )} kg (${(ratio * 100).toFixed(0)}%)`;

      requestAnimationFrame(update);
    }

    update();
  }

  /**
   * إزالة مجلد تحكم
   */
  remove(name) {
    if (this.folders[name]) {
      this.gui.removeFolder(this.folders[name]);
      delete this.folders[name];
    }
  }
}
