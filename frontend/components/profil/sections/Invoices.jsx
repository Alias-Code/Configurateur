import styled from "@emotion/styled";
import Spinner from "../../common/Spinner";
import { TitleStyle } from "../../utils/SharedStyle";
import { useEffect, useState } from "react";
import { useNotificationsContext } from "../../../context/NotificationsContext";

const DevisContainer = styled.div`
  hr {
    border: 1px solid #e0e0e0;
    margin: 1rem 0;
    width: 100%;
  }
`;

const InvoiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const InvoiceCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: black;
  }
`;

const InvoiceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const InvoiceSource = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  img {
    width: 1.2rem;
    height: 1.2rem;
    transform: translateX(-1px);
    filter: invert(1);
  }
`;

const InvoiceDate = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  img {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

const DownloadButton = styled.a`
  background-color: #245e24;
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease;

  img {
    width: 1.2rem;
    height: auto;
  }

  &:hover {
    background-color: #4d9c4d;
  }
`;

export default function Devis() {
  const { setNotifications } = useNotificationsContext();
  const [userInvoice, setUserInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH USER INVOICES ---
  const fetchUserInvoices = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotifications({ content: "Vous devez être connecté pour accéder aux devis.", type: "error" });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/order/getinvoices`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // DEVIS DU PLUS RECENT AU PLUS ANCIEN
        const sortedInvoices = data.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        setUserInvoices(sortedInvoices || []);
        setLoading(false);
      }
    } catch (error) {
      setNotifications({ content: error.message, type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInvoices();
  }, []);

  function decodeQuotedPrintable(str) {
    const decodedQuotedPrintable = str.replace(/=\?UTF-8\?Q\?([^?]+)\?=/g, function (_, enc) {
      return decodeURIComponent(enc.replace(/=([A-F0-9]{2})/g, "%$1"));
    });

    return decodeURIComponent(escape(decodedQuotedPrintable));
  }

  return (
    <DevisContainer>
      <TitleStyle fontWeight="700">HISTORIQUE DE VOS DEVIS</TitleStyle>
      <hr />
      {loading ? (
        <Spinner />
      ) : userInvoice.length === 0 ? (
        <p>
          <strong>Vous n'avez aucun devis.</strong>
        </p>
      ) : (
        <InvoiceList>
          {userInvoice.map((invoice, index) => (
            <InvoiceCard key={index}>
              <InvoiceInfo>
                <InvoiceSource>
                  {invoice.source === "Commande" ? <img src="/order.svg" alt="Devis provenant d'une commande" /> : <img src="/printer.svg" alt="Devis provenant d'une génération" />}
                  {decodeQuotedPrintable(invoice.source)} {invoice.source === "Commande" && `N°${invoice.orderId}`}
                </InvoiceSource>
                <InvoiceDate>
                  <img src="/clock.svg" alt="Date de la création du devis" />
                  {new Date(invoice.lastModified).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </InvoiceDate>
              </InvoiceInfo>
              <DownloadButton href={invoice.signedUrl} target="_blank">
                <img src="/download.svg" alt="Téléchargement du devis" />
                Télécharger
              </DownloadButton>
            </InvoiceCard>
          ))}
        </InvoiceList>
      )}
    </DevisContainer>
  );
}
