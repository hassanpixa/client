import React from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import QRCode from "qrcode";
import * as svg from "polotno/utils/svg";
import ImQrcode from "@meronex/icons/im/ImQrcode";
import { Button, InputGroup } from "@blueprintjs/core";
import { useDispatch } from "react-redux";
import { qrHandler } from "store/slices/uiSlice";
// create svg image for QR code for input text
export async function getQR(text) {
  return new Promise((resolve) => {
    QRCode.toString(
      text || "no-data",
      {
        type: "svg",
        color: {
          dark: "#000000", // Blue dots
          light: "#FFFFFF", // Transparent background
        },
      },
      (err, string) => {
        resolve(svg.svgToURL(string));
      }
    );
  });
}

// define the new custom section
export const QrSection = {
  name: "qr",
  Tab: (props) => (
    <SectionTab name="Qr" {...props}>
      <ImQrcode />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: observer(({ store }) => {
    const [inputValues, setInputValues] = React.useState([""]);

    const concatenatedValue = inputValues.join("\n"); // Concatenate input values with line breaks

    const dispatch = useDispatch();
    const generateQRCode = () => {
      dispatch(qrHandler());
      getQR(concatenatedValue).then((src) => {
        store.activePage?.addElement({
          type: "svg",
          name: "qr",
          id: "q",
          x: 50, // Adjust position as needed
          y: 50,
          width: 200,
          height: 200,
          src,
          custom: {
            value: concatenatedValue,
          },
        });
      });
    };
    const removeInputField = () => {
      if (inputValues.length > 1) {
        setInputValues(inputValues.slice(0, -1));
      }
    };
    return (
      <div>
        <p>Create new QR code(s):</p>
        {inputValues.map((value, index) => (
          <div key={index}>
            <InputGroup
              className="qr_input"
              onChange={(e) => {
                const newInputValues = [...inputValues];
                newInputValues[index] = e.target.value;
                setInputValues(newInputValues);
              }}
              placeholder={`Type qr code content ${index + 1}`}
              value={value}
              style={{ width: "100%" }}
            />
          </div>
        ))}

        <div className="qr_button_div">
          <Button onClick={generateQRCode} className="primary_btn qr_button">
            Add QR code
          </Button>
          <Button
            onClick={() => {
              setInputValues([...inputValues, ""]); // Add a new input field
            }}
            className="secondary_btn qr_button"
          >
            Add input field
          </Button>
          <Button onClick={removeInputField} className="secondary_btn qr_button">
            Remove input field
          </Button>
          <Button
            onClick={() => {
              setInputValues(
                inputValues.filter(
                  (_, index) => index === inputValues.length - 1
                )
              );
            }}
            className="clear_btn qr_button"
          >
            Clear All
          </Button>
        </div>
        {/* <div>
          <Button
            onClick={() => {
              setInputValues([]);
            }}
          >
            Clear All
          </Button>
        </div> */}
      </div>
    );
  }),
};
