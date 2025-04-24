import { DatePipe } from "@angular/common";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';

export function FindInvalidControls(form: FormGroup) {
  const invalid = [];
  const controls = form.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

export function validateAccess(accessName: string, currentAccessList: any = []) {
  return currentAccessList.indexOf(accessName) > -1
}
export async function getBase64FromUrl(url: string) {
  const data = await fetch(url);
  const blob = await data.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    }
  });
}

export function dataURItoBlob(ImageURL: any, sliceSize: any = null) {
  try {

    var block = ImageURL.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];//
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(realData);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  } catch (e) {
    return "";
  }
}

export function buildFormData(formData: FormData, data: any, parentKey: any = '') {

  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    if (typeof data === 'object' && moment.isMoment(data.startDate)) {
      formData.append(parentKey, data.startDate?.toISOString());
    } else {
      Object.keys(data).forEach(key => {
        buildFormData(formData, data[key], parentKey ? `${parentKey}${parseInt(key)
          >= 0 ? `[${key}]` : `.${key}`}` : key);
      });

    }
  } else if (data && typeof data === 'string' && (parentKey.indexOf("startDateUTC") > -1 || parentKey.indexOf("endDateUTC") > -1 || parentKey.indexOf("displayDateTimeUTC") > -1)) {
    formData.append(parentKey, moment(data).toISOString());
  } else {

    const value = data == null ? '' : data;
    // if (parentKey.indexOf("displayDateTimeUTC") > -1) {
    //   //formData.append(parentKey, undefined)
    // } else
    formData.append(parentKey, value);
  }
}

function getControlName(c: AbstractControl): string | null {
  const formGroup: any = c.parent?.controls;
  return formGroup ? Object.keys(formGroup).find((name: any) => c === formGroup[name]) || null : null;
}
export function validateAllFormFields(employeedetail: FormGroup) {
  let errorList: string[] = [];
  Object.keys(employeedetail.controls).forEach(field => {  //{2}
    const control = employeedetail.get(field);
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
      const controlErrors = control?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          errorList.push("Invalid " + field)
          //console.log('Key control: ' + field + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    } else if (control instanceof FormGroup) {
      let errorItems = validateAllFormFields(control);     //{5}

      errorList = errorList.concat(errorItems);            //{6}
    } else if (control instanceof FormArray) {
      let arrayItems = control as FormArray;
      const controlErrors = control?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          errorList.push("Invalid " + field)
          //console.log('Key control: ' + field + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
      if (arrayItems.length > 0 && arrayItems.controls.length > 0) {
        for (let i = 0; i < arrayItems.controls.length; i++) {
          let childErr = validateAllFormFields(arrayItems.controls[i] as FormGroup)
          if (childErr.length > 0) {
            errorList.push("Invalid " + field + " " + i);
            errorList = errorList.concat(childErr)

          }
        }
      }
    }
  });
  return errorList;
}

export function smallerThanOrEqual(otherControlName: string) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null; // Control is not yet associated with a parent.
    }
    const thisValue = control.value;
    const otherValue = control.parent.get(otherControlName)?.value;
    if (thisValue <= otherValue) {
      return null;
    }
    return {
      'smallerthanorequal': true
    }
  };
}

export function greaterThanOrEqual(otherControlName: string) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null; // Control is not yet associated with a parent.
    }
    const thisValue = control.value;
    const otherValue = control.parent.get(otherControlName)?.value;
    if (thisValue >= otherValue) {
      return null;
    }
    return {
      'greaterthanorequal': true
    }
  };
}

export function greaterThan(otherControlName: string) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null; // Control is not yet associated with a parent.
    }
    const thisValue = control.value;
    const otherValue = control.parent.get(otherControlName)?.value;
    if (thisValue > otherValue) {
      return null;
    }
    return {
      'greaterthan': true
    }
  };
}

export function smallerEqualDate(otherControlName: string) {
  let datepipe = new DatePipe("en-US");
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null; // Control is not yet associated with a parent.
    }
    const thisValue = control.value;
    const otherValue = control.parent.get(otherControlName)?.value;

    const small = datepipe.transform(thisValue, 'yyyy-MM-dd');
    const big = datepipe.transform(otherValue, 'yyyy-MM-dd');
    if (small && big && small <= big) {
      return null;
    }
    return {
      'notsmallerequal': true
    }
  };

}

export function validateGameForm(employeedetail: FormGroup, controlParentName: string = "") {
  let errorList: string[] = [];
  Object.keys(employeedetail.controls).forEach(field => {  //{2}
    const control = employeedetail.get(field);
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
      const controlErrors = control?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          errorList.push("Invalid " + controlParentName + " " + field)
          //console.log('Key control: ' + field + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    } else if (control instanceof FormGroup) {
      if (field.toLowerCase().indexOf("json") > -1 && !control.valid) {
        errorList.push(field)
      } else {
        let errorItems = validateGameForm(control, field);     //{5}

        errorList = errorList.concat(errorItems);            //{6}

      }

    } else if (control instanceof FormArray) {
      let arrayItems = control as FormArray;
      const controlErrors = control?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          errorList.push("Invalid " + controlParentName + " " + field)
          //console.log('Key control: ' + field + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
      if (arrayItems.length > 0 && arrayItems.controls.length > 0) {
        for (let i = 0; i < arrayItems.controls.length; i++) {
          let childErr = validateGameForm(arrayItems.controls[i] as FormGroup, field)
          if (childErr.length > 0) {
            errorList.push("Invalid " + field + " " + i);
            errorList = errorList.concat(childErr)

          }
        }
      }
    }
  });
  return errorList;
}