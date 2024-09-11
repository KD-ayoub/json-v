import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button, ColorPicker, Input, Segmented } from "antd";
import { AggregationColor, toHexFormat } from "antd/es/color-picker/color";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { produce } from "immer";
import { toPng, toJpeg, toSvg } from "html-to-image";
import rgbHex from "rgb-hex";
import useModal from "../visualize/lib/useModal";

type DownloadDataType = {
  fileName: string;
  fileFormat: string;
  background: string;
};

export default function DownloadModalContent() {
    const { setIsModalOpen } = useModal();
  const [downloadData, setDownloadData] = useState<DownloadDataType>({
    fileName: "jsonView",
    fileFormat: "PNG",
    background: "#FFFFFF",
  });
  function handleFileFormat(value: string) {
    console.log(value);
    setDownloadData(
      produce(downloadData, (draft) => {
        draft.fileFormat = value;
      })
    );
  }
  function handleBackgroundChange(agregation: AggregationColor, css: string) {
    console.log("bg: ", agregation, css);
    const hexColor = agregation.toHex();
    setDownloadData(
      produce(downloadData, (draft) => {
        draft.background = `#${hexColor}`;
      })
    );
  }
  function getFormatFunction(format: string) {
    switch (format) {
      case "SVG":
        return toSvg;
      case "PNG":
        return toPng;
      default:
        return toJpeg;
    }
  }
  function handleDownload(values: { fileName: string }) {
    console.log("afte", values, downloadData);
    const toFormat = getFormatFunction(downloadData.fileFormat);
    toFormat(document.getElementsByClassName("test-class")[0] as HTMLElement, {
      quality: 1,
      backgroundColor: downloadData.background,

    })
      .then((data) => {
        console.log("aftertoSVg", data);
        const link = document.createElement('a');
        link.download = downloadData.fileName;
        link.href = data;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  return (
    <Formik
      initialValues={{
        fileName: "jsonView",
      }}
      validationSchema={Yup.object({
        fileName: Yup.string()
          .max(30, "Must be 30 characters or less")
          .required("This field is required"),
      })}
      onSubmit={handleDownload}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <label>
            <span>File Name</span>
            <Input
              id="fileName"
              className="mb-3"
              value={formik.values.fileName}
              onChange={(e) => {
                setDownloadData(
                  produce(downloadData, (draft) => {
                    draft.fileName = e.target.value;
                  })
                );
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              status={
                formik.touched.fileName && formik.errors.fileName ? "error" : ""
              }
              placeholder="File Name"
            />
            {formik.touched.fileName && formik.errors.fileName && (
              <p className="text-xs italic text-red-500">
                {formik.errors.fileName}
              </p>
            )}
          </label>
          <div className="mb-3">
            <Segmented
              defaultValue="PNG"
              onChange={handleFileFormat}
              options={["SVG", "PNG", "JPEG"]}
              block
            />
          </div>
          <div className="mb-3">
            <label className="flex flex-col">
              <span>Background Color</span>
              <ColorPicker
                className="justify-start"
                disabledAlpha
                defaultFormat="hex"
                defaultValue={"#FFFFFF"}
                showText
                allowClear
                onChange={handleBackgroundChange}
                onFormatChange={(format) => console.log("fff", format)}
              />
            </label>
          </div>
          <div className="flex justify-end">
            <Button
              htmlType="submit"
              type="primary"
              icon={<ArrowDownTrayIcon className="w-4" />}
            >
              Download
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
