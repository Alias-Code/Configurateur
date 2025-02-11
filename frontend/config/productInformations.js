const productInformations = {
  Collections: [
    {
      id: "Vendome",
      name: "Vendome",
      src: "/Vendome.png",
    },
  ],

  Couleurs: [
    { id: "CL-N", name: "Couleur Noir", value: 0 },
    { id: "CL-CF", name: "Couleur Canon De Fusil", value: 5 },
    { id: "CL-AC", name: "Couleur Acier", value: 10 },
    { id: "CL-BZ", name: "Couleur Bronze", value: 15 },
    { id: "CL-LT", name: "Couleur Laiton", value: 20 },
    { id: "CL-BM", name: "Couleur Blanc Mat", value: 25 },
  ],

  Gravures: [{ id: "G-PS", name: "Gravure Personnalisée", price: 40 }],

  Facades: [
    { id: "N-1", name: "Facade Simple Neutre", price: 60, width: "3", height: "3" },
    { id: "DH-2", name: "Facade Double Horizontale", price: 120, width: "6", height: "3" },
    { id: "TH-3", name: "Facade Triple Horizontale", price: 180, width: "9", height: "3" },
    { id: "DV-2", name: "Facade Double Verticale", price: 120, width: "3", height: "6" },
    { id: "TV-3", name: "Facade Triple Verticale", price: 180, width: "3", height: "9" },
  ],

  Prises: [
    { id: "P-CB", name: "Prise Courant Blanc", price: 20 },
    { id: "P-CN", name: "Prise Courant Noir", price: 20 },
    { id: "P-HDMI", name: "Prise HDMI", price: 30 },
    { id: "P-RJ45", name: "Prise RJ45", price: 30 },
    { id: "P-USBC", name: "Prise USB-C", price: 30 },
    { id: "P-USBAC", name: "Prise USB A+C", price: 30 },
    { id: "P-HP", name: "Prise Haut-Parleur", price: 30 },
    { id: "P-TV", name: "Prise TV", price: 30 },
  ],

  Retros: [
    // --- RETROS VA-ET-VIENT ---
    { id: "R-N-VV", name: "Rétro Noir Va-Et-Vient", price: 30, type: "VV" },
    { id: "R-CF-VV", name: "Rétro Canon de Fusil Va-Et-Vient", price: 30, type: "VV" },
    { id: "R-AC-VV", name: "Rétro Acier Va-Et-Vient", price: 30, type: "VV" },
    { id: "R-BZ-VV", name: "Rétro Bronze Va-Et-Vient", price: 30, type: "VV" },
    { id: "R-LT-VV", name: "Rétro Laiton Va-Et-Vient", price: 40, type: "VV" },
    { id: "R-CU-VV", name: "Rétro Cuivre Va-Et-Vient", price: 30, type: "VV" },
    // --- RETROS VOLET ROULANT ---
    { id: "R-N-VR", name: "Rétro Noir Volet Roulant", price: 40, type: "VR" },
    { id: "R-CF-VR", name: "Rétro Canon de Fusil Volet Roulant", price: 40, type: "VR" },
    { id: "R-AC-VR", name: "Rétro Acier Volet Roulant", price: 40, type: "VR" },
    { id: "R-BZ-VR", name: "Rétro Bronze Volet Roulant", price: 40, type: "VR" },
    { id: "R-LT-VR", name: "Rétro Laiton Volet Roulant", price: 50, type: "VR" },
    { id: "R-CU-VR", name: "Rétro Cuivre Volet Roulant", price: 40, type: "VR" },
    // --- RETRO POUSSOIR ---
    { id: "R-N-P", name: "Rétro Noir Poussoir", price: 50, type: "P" },
    { id: "R-CF-P", name: "Rétro Canon de Fusil Poussoir", price: 50, type: "P" },
    { id: "R-AC-P", name: "Rétro Acier Poussoir", price: 50, type: "P" },
    { id: "R-BZ-P", name: "Rétro Bronze Poussoir", price: 50, type: "P" },
    { id: "R-LT-P", name: "Rétro Laiton Poussoir", price: 60, type: "P" },
    { id: "R-CU-P", name: "Rétro Cuivre Poussoir", price: 50, type: "P" },
  ],

  Cylindres: [
    // --- CYLINDRE VA-ET-VIENT ---
    { id: "C-N-VV", name: "Cylindre Noir Va-Et-Vient", price: 20, type: "VV" },
    { id: "C-CF-VV", name: "Cylindre Canon de Fusil Va-Et-Vient", price: 20, type: "VV" },
    { id: "C-AC-VV", name: "Cylindre Acier Va-Et-Vient", price: 20, type: "VV" },
    { id: "C-BZ-VV", name: "Cylindre Bronze Va-Et-Vient", price: 20, type: "VV" },
    { id: "C-LT-VV", name: "Cylindre Laiton Va-Et-Vient", price: 30, type: "VV" },
    { id: "C-CU-VV", name: "Cylindre Cuivre Va-Et-Vient", price: 20, type: "VV" },
    // --- CYLINDRE VOLET ROULANT ---
    { id: "C-N-VR", name: "Cylindre Noir Volet Roulant", price: 30, type: "VR" },
    { id: "C-CF-VR", name: "Cylindre Canon de Fusil Volet Roulant", price: 30, type: "VR" },
    { id: "C-AC-VR", name: "Cylindre Acier Volet Roulant", price: 30, type: "VR" },
    { id: "C-BZ-VR", name: "Cylindre Bronze Volet Roulant", price: 30, type: "VR" },
    { id: "C-LT-VR", name: "Cylindre Laiton Volet Roulant", price: 40, type: "VR" },
    { id: "C-CU-VR", name: "Cylindre Cuivre Volet Roulant", price: 30, type: "VR" },
    // --- CYLINDRE POUSSOIR ---
    { id: "C-N-P", name: "Cylindre Noir Poussoir", price: 40, type: "P" },
    { id: "C-CF-P", name: "Cylindre Canon de Fusil Poussoir", price: 40, type: "P" },
    { id: "C-AC-P", name: "Cylindre Acier Poussoir", price: 40, type: "P" },
    { id: "C-BZ-P", name: "Cylindre Bronze Poussoir", price: 40, type: "P" },
    { id: "C-LT-P", name: "Cylindre Laiton Poussoir", price: 50, type: "P" },
    { id: "C-CU-P", name: "Cylindre Cuivre Poussoir", price: 40, type: "P" },
  ],

  Variateurs: [
    { id: "VA-N", name: "Variateur Noir", price: 20 },
    { id: "VA-CF", name: "Variateur Canon de Fusil", price: 20 },
    { id: "VA-AC", name: "Variateur Acier", price: 20 },
    { id: "VA-BZ", name: "Variateur Bronze", price: 20 },
    { id: "VA-LT", name: "Variateur Laiton", price: 30 },
    { id: "VA-CU", name: "Variateur Cuivre", price: 20 },
  ],

  Liseuses: [
    { id: "LI-N", name: "Liseuse Noir", price: 20 },
    { id: "LI-CF", name: "Liseuse Canon de Fusil", price: 20 },
    { id: "LI-AC", name: "Liseuse Acier", price: 20 },
    { id: "LI-BZ", name: "Liseuse Bronze", price: 20 },
    { id: "LI-LT", name: "Liseuse Laiton", price: 30 },
    { id: "LI-BM", name: "Liseuse Blanc", price: 20 },
  ],
};

export default productInformations;
