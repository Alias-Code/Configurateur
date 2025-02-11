import React, { useEffect, useState } from "react";

const InvoiceViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const rawCart = JSON.parse(localStorage.getItem("configurations"));

        const cartArray = Object.values(rawCart);

        const cartWithoutImages = cartArray.map((config) => {
          const { image, ...configWithoutImage } = config;
          return configWithoutImage;
        });

        const response = await fetch("http://localhost:3000/api/order/generateinvoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cart: cartWithoutImages }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } else {
          console.error("Erreur lors de la récupération du PDF", response.statusText);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchInvoice(); // Fetch initial

    const interval = setInterval(() => {
      fetchInvoice(); // Fetch every 30 seconds
    }, 10000); // 30 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, []);

  return (
    <div>
      <iframe src={pdfUrl} width="90%" height="1000px" title="Invoice PDF" />
    </div>
  );
};

export default InvoiceViewer;
