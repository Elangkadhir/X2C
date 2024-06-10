import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import map from "../Assets/WhatsApp Image 2024-06-08 at 11.06.51 AM.jpeg";
import { IoLocationSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function CardPage() {
  const location = useLocation();
  const { selectedRows = [], customerName } = location.state || {};
  const customerNameRef = useRef();
  const printRef = useRef();

  console.log("customer name from card page", customerName);
  console.log("selected rows from card page", selectedRows);

  const handleDownload = async () => {
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let yOffset = 10;

    // Capture customer name section
    const nameCanvas = await html2canvas(customerNameRef.current, {
      useCORS: true,
    });
    const nameData = nameCanvas.toDataURL("image/png");
    const nameProperties = pdf.getImageProperties(nameData);
    const nameHeight =
      (nameProperties.height * pdfWidth) / nameProperties.width;
    pdf.addImage(nameData, "PNG", 10, yOffset, pdfWidth - 20, nameHeight);
    yOffset += nameHeight + 10;

    // Capture each row section
    for (const row of selectedRows) {
      const element = document.getElementById(`printSection${row.sno}`);

      // Capture the entire section
      const canvas = await html2canvas(element, { useCORS: true });
      const data = canvas.toDataURL("image/png");

      const imgProperties = pdf.getImageProperties(data);
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      if (yOffset + pdfHeight > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        yOffset = 10;
      }

      // Capture the map section separately to get its position
      const mapElement = element.querySelector("img");
      const mapCanvas = await html2canvas(mapElement, { useCORS: true });
      const mapData = mapCanvas.toDataURL("image/png");

      // Add the entire section image
      pdf.addImage(data, "PNG", 10, yOffset, pdfWidth - 20, pdfHeight);

      // Calculate position of the map image within the section
      const mapRect = mapElement.getBoundingClientRect();
      const mapX =
        10 +
        ((mapRect.left - element.getBoundingClientRect().left) *
          (pdfWidth - 20)) /
          element.offsetWidth;
      const mapY =
        yOffset +
        (mapRect.top - element.getBoundingClientRect().top) *
          (pdfHeight / element.offsetHeight);
      const mapWidth = (mapRect.width * (pdfWidth - 20)) / element.offsetWidth;
      const mapHeight = (mapRect.height * pdfHeight) / element.offsetHeight;

      // Add link only around the map image
      pdf.link(mapX, mapY, mapWidth, mapHeight, {
        url: `https://www.google.com/maps/search/?api=1&query=${row.lat},${row.long}`,
      });

      yOffset += pdfHeight + 10;
    }

    pdf.save("download.pdf");
  };

  return (
    <div ref={printRef}>
      <section
        ref={customerNameRef}
        className="home w-screen h-screen"
      >
        <div className="text-slate-800 text-5xl font-bold pt-20 pl-20">
          Property Details for
        </div>
        <div className="text-white text-5xl font-bold pt-4 pl-20">
          {customerName}
        </div>
      </section>
      {selectedRows.map((row, index) => (
        <section
          id={`printSection${row.sno}`}
          key={index}
          className="home w-screen h-screen bg-green-500 mt-10 items-center px-10"
        >
          <div className="text-3xl font-bold mb-5">
            {row.areaName}
            {row["Land Size"] && ` (${row["Land Size"]})`}
          </div>
          <div className="container mx-auto flex flex-row items-stretch w-full pt-5">
            <div className="w-1/2 flex items-center justify-center relative">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${row.lat},${row.long}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={map}
                  alt="Map"
                  className="w-[75%] h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute bottom-[50%] left-[20%] flex items-center gap-2 bg-black p-2 rounded">
                  <IoLocationSharp className="text-red-600 text-5xl" />
                  <div className="font-bold text-2xl text-white">
                    {row.areaName}
                  </div>
                </div>
              </a>
            </div>
            <div className="w-1/2 flex items-center justify-center">
              <table className="table-fixed w-full h-full bg-white shadow-lg rounded-lg">
                <tbody className="flex flex-col w-full">
                  {Object.entries(row)
                    .filter(
                      ([key]) =>
                        !["sno", "lat", "long", "areaName"].includes(key)
                    )
                    .map(([key, value]) => (
                      <tr
                        key={key}
                        className="border w-full bg-gradient-to-r from-red-400 to-blue-500 flex"
                      >
                        <td className="px-2 py-2 font-bold w-[30%]">{key}</td>
                        <td className="bg-gradient-to-r from-blue-400 to-red-500 px-4 py-2 w-[70%]">
                          {value}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default CardPage;
