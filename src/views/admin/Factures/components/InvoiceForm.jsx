// InvoiceForm.js
import React, { useState, useEffect } from 'react';
import { supabase } from './../../../../supabaseClient';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  IconButton,
  Heading,
  Divider,
  useToast,
  FormErrorMessage,
  Tooltip,
  Select,
  Image,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FcMoneyTransfer } from 'react-icons/fc';
import { useEvent } from '../../../../EventContext'; // Import du contexte d'événement

const VAT_RATES = [
  { label: '20% (Standard)', value: 20 },
  { label: '10% (Intermédiaire)', value: 10 },
  { label: '5.5% (Réduit)', value: 5.5 },
  { label: '2.1% (Super réduit)', value: 2.1 },
];

const InvoiceForm = () => {
  const toast = useToast();
  const { selectedEventId } = useEvent(); // Récupère l'ID de l'événement sélectionné
  const [errors, setErrors] = useState({});
  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: '',
    invoiceNumber: '',
    saleDate: '',
    // Les informations du vendeur seront pré-remplies
    sellerName: '',
    sellerAddress: '',
    sellerSiren: '',
    sellerSiret: '',
    sellerLegalForm: '',
    sellerCapital: '',
    sellerRCS: '',
    sellerGreffe: '',
    sellerRM: '',
    sellerVATNumber: '',
    logoUrl: '', 
    buyerName: '',
    buyerAddress: '',
    deliveryAddress: '',
    billingAddress: '',
    orderNumber: '',
    buyerVATNumber: '',
    productDetails: [{ description: '', quantity: '', unitPrice: '', vatRate: '' }],
    discount: '',
    totalHT: '0.00',
    totalTTC: '0.00',
    paymentDueDate: '',
    discountConditions: '',
    latePaymentPenalties: '',
    warrantyInfo: '',
    specialMention: '',
  });

  const [logoFile, setLogoFile] = useState(null); // État pour le fichier logo

  useEffect(() => {
    // Récupérer les informations du vendeur
    const fetchSellerInfo = async () => {
      const { data, error } = await supabase
        .from('vianney_seller_info')
        .select('*')
        .eq('event_id', selectedEventId)
        .single();

      if (data) {
        setInvoiceData((prevData) => ({
          ...prevData,
          sellerName: data.seller_name || '',
          sellerAddress: data.seller_address || '',
          sellerSiren: data.seller_siren || '',
          sellerSiret: data.seller_siret || '',
          sellerLegalForm: data.seller_legal_form || '',
          sellerCapital: data.seller_capital || '',
          sellerRCS: data.seller_rcs || '',
          sellerGreffe: data.seller_greffe || '',
          sellerRM: data.seller_rm || '',
          sellerVATNumber: data.seller_vat_number || '',
          codeAPE: data.code_ape || '',
          sellerVatIntracommunityNumber: data.seller_vat_intracommunity_number || '',
          logoUrl: data.logo_url || '',
        }));
      } else if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération des informations du vendeur:', error);
      }
    };

    if (selectedEventId) {
      fetchSellerInfo();
    }
  }, [selectedEventId]);

  // Fonction handleChange pour gérer les changements des champs généraux
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation pour les champs numériques
    if (['buyerVATNumber', 'discount'].includes(name)) {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Ce champ doit contenir uniquement des chiffres.',
        }));

        toast({
          title: 'Erreur de saisie',
          description: 'Ce champ doit contenir uniquement des chiffres.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }));
      }
    }

    setInvoiceData({ ...invoiceData, [name]: value });
  };

  // Fonction pour gérer les changements des produits/services
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...invoiceData.productDetails];

    if (['quantity', 'unitPrice', 'vatRate'].includes(name)) {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`product-${index}-${name}`]: 'Ce champ doit contenir uniquement des chiffres ou un point décimal.',
        }));

        toast({
          title: 'Erreur de saisie',
          description: 'Ce champ doit contenir uniquement des chiffres ou un point décimal.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`product-${index}-${name}`]: null,
        }));
      }
    }

    updatedProducts[index][name] = value;
    setInvoiceData({ ...invoiceData, productDetails: updatedProducts });
  };

  // Fonction pour ajouter un produit/service
  const addProduct = () => {
    setInvoiceData({
      ...invoiceData,
      productDetails: [...invoiceData.productDetails, { description: '', quantity: '', unitPrice: '', vatRate: '' }]
    });
  };

  // Fonction pour supprimer un produit/service
  const removeProduct = (index) => {
    const updatedProducts = invoiceData.productDetails.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, productDetails: updatedProducts });
  };

  // Fonction pour gérer le changement du fichier logo
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // Calcul automatique de Total HT et Total TTC
  useEffect(() => {
    const calculateTotals = () => {
      // Calcul du Total HT (avant remise)
      const baseHT = invoiceData.productDetails.reduce((acc, product) => {
        const quantity = parseFloat(product.quantity) || 0;
        const unitPrice = parseFloat(product.unitPrice) || 0;
        return acc + (quantity * unitPrice);
      }, 0);

      // Récupérer la remise
      const discount = parseFloat(invoiceData.discount) || 0;

      // Assurer que la remise ne dépasse pas le Total HT
      const validDiscount = discount > baseHT ? baseHT : discount;

      // Calcul de la remise proportionnelle pour chaque produit
      const discountedProducts = invoiceData.productDetails.map(product => {
        const productHT = (parseFloat(product.quantity) * parseFloat(product.unitPrice)) || 0;
        const productShare = baseHT > 0 ? productHT / baseHT : 0;
        const productDiscount = validDiscount * productShare;
        const discountedHT = productHT - productDiscount;
        const vatRate = parseFloat(product.vatRate) || 0;
        const vatAmount = discountedHT * (vatRate / 100);
        return {
          ...product,
          discountedHT,
          vatAmount,
        };
      });

      // Calcul de la TVA totale
      const vatTotal = discountedProducts.reduce((acc, product) => acc + product.vatAmount, 0);

      // Calcul du Total HT après remise
      const totalHTAfterDiscount = baseHT - validDiscount;

      // Calcul du Total TTC
      const totalTTC = totalHTAfterDiscount + vatTotal;

      setInvoiceData((prevData) => ({
        ...prevData,
        totalHT: totalHTAfterDiscount.toFixed(2),
        totalTTC: totalTTC.toFixed(2),
      }));
    };

    calculateTotals();
  }, [invoiceData.productDetails, invoiceData.discount]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoUrl = invoiceData.logoUrl; // Conserver l'URL actuelle si aucune modification

    // Télécharger le logo si un nouveau fichier est sélectionné
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${selectedEventId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('seller-logos')
        .upload(filePath, logoFile);

      if (uploadError) {
        toast({
          title: 'Erreur',
          description: 'Erreur lors du téléchargement du logo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Obtenir l'URL publique du logo
      const { data: publicURLData, error: urlError } = supabase.storage
        .from('seller-logos')
        .getPublicUrl(filePath);

      if (urlError) {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la récupération de l\'URL du logo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      logoUrl = publicURLData.publicUrl;
    }

    // Générer le prochain numéro de facture en appelant la fonction stockée
    const { data: invoiceNumberData, error: invoiceNumberError } = await supabase
      .rpc('generate_invoice_number', { event_uuid: selectedEventId });

    if (invoiceNumberError) {
      console.error('Erreur lors de la génération du numéro de facture:', invoiceNumberError);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la génération du numéro de facture.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const invoiceNumber = invoiceNumberData;

    // Préparer les produits sans remises et TVA, car elles sont déjà appliquées
    const products = invoiceData.productDetails.map(product => ({
      description: product.description || '',
      quantity: parseFloat(product.quantity) || 0,
      unitPrice: parseFloat(product.unitPrice) || 0,
      vatRate: parseFloat(product.vatRate) || 0,
    }));

    const dataToInsert = {
      invoice_date: invoiceData.invoiceDate || null,
      invoice_number: invoiceNumber, // Utiliser le numéro de facture généré
      sale_date: invoiceData.saleDate || null,
      seller_name: invoiceData.sellerName || null,
      seller_address: invoiceData.sellerAddress || null,
      seller_siren: invoiceData.sellerSiren || null,
      seller_siret: invoiceData.sellerSiret || null,
      seller_legal_form: invoiceData.sellerLegalForm || null,
      seller_capital: invoiceData.sellerCapital ? parseFloat(invoiceData.sellerCapital) : null,
      seller_rcs: invoiceData.sellerRCS || null,
      seller_greffe: invoiceData.sellerGreffe || null,
      seller_rm: invoiceData.sellerRM || null,
      seller_vat_number: invoiceData.sellerVATNumber || null,
      buyer_name: invoiceData.buyerName || null,
      buyer_address: invoiceData.buyerAddress || null,
      delivery_address: invoiceData.deliveryAddress || null,
      billing_address: invoiceData.billingAddress || null,
      order_number: invoiceData.orderNumber || null,
      buyer_vat_number: invoiceData.buyerVATNumber || null,
      products: products.length > 0 ? products : null,
      discount: invoiceData.discount ? parseFloat(invoiceData.discount) : null,
      total_ht: parseFloat(invoiceData.totalHT) || null,
      total_ttc: parseFloat(invoiceData.totalTTC) || null,
      payment_due_date: invoiceData.paymentDueDate || null,
      discount_conditions: invoiceData.discountConditions || null,
      late_payment_penalties: invoiceData.latePaymentPenalties || null,
      warranty_info: invoiceData.warrantyInfo || null,
      special_mention: invoiceData.specialMention || null,
      logo_url: logoUrl || null, // Ajouter l'URL du logo
      event_id: selectedEventId || null,
    };

    const { error } = await supabase
      .from('vianney_factures')
      .insert(dataToInsert);

    if (error) {
      console.error('Erreur lors de l\'insertion de la facture:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la soumission de la facture. Veuillez vérifier les champs et réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('Facture soumise avec succès');
      toast({
        title: 'Succès',
        description: `Facture ${invoiceNumber} soumise avec succès.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Réinitialiser le formulaire après soumission réussie
      setInvoiceData({
        invoiceDate: '',
        invoiceNumber: '',
        saleDate: '',
        // Les informations du vendeur restent pré-remplies
        sellerName: invoiceData.sellerName,
        sellerAddress: invoiceData.sellerAddress,
        sellerSiren: invoiceData.sellerSiren,
        sellerSiret: invoiceData.sellerSiret,
        sellerLegalForm: invoiceData.sellerLegalForm,
        sellerCapital: invoiceData.sellerCapital,
        sellerRCS: invoiceData.sellerRCS,
        sellerGreffe: invoiceData.sellerGreffe,
        sellerRM: invoiceData.sellerRM,
        sellerVATNumber: invoiceData.sellerVATNumber,
        logoUrl: invoiceData.logoUrl, // Conserver l'URL du logo
        buyerName: '',
        buyerAddress: '',
        deliveryAddress: '',
        billingAddress: '',
        orderNumber: '',
        buyerVATNumber: '',
        productDetails: [{ description: '', quantity: '', unitPrice: '', vatRate: '' }],
        discount: '',
        totalHT: '0.00',
        totalTTC: '0.00',
        paymentDueDate: '',
        discountConditions: '',
        latePaymentPenalties: '',
        warrantyInfo: '',
        specialMention: '',
      });
      setLogoFile(null);
      setErrors({});
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} display="flex" alignItems="center">
        <FcMoneyTransfer style={{ marginRight: '10px' }} />
        Factures
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Date de la facture */}
          <FormControl id="invoiceDate">
            <FormLabel>Date de la facture</FormLabel>
            <Input
              type="date"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleChange}
            />
          </FormControl>

          {/* Date de la vente/prestation */}
          <FormControl id="saleDate">
            <FormLabel>Date de la vente/prestation</FormLabel>
            <Input
              type="date"
              name="saleDate"
              value={invoiceData.saleDate}
              onChange={handleChange}
            />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations sur le vendeur</Heading>

          {/* Afficher le logo actuel */}
          {invoiceData.logoUrl && (
            <Box>
              <FormLabel>Logo Actuel</FormLabel>
              <Image src={invoiceData.logoUrl} alt="Logo du vendeur" maxW="200px" />
            </Box>
          )}

          {/* Champ pour télécharger un nouveau logo */}
          <FormControl id="logo">
            <FormLabel>Logo</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </FormControl>

          {/* Nom du vendeur */}
          <FormControl id="sellerName">
            <FormLabel>Nom du vendeur</FormLabel>
            <Input
              type="text"
              name="sellerName"
              value={invoiceData.sellerName}
              isReadOnly
            />
          </FormControl>

          {/* Adresse du vendeur */}
          <FormControl id="sellerAddress">
            <FormLabel>Adresse du vendeur</FormLabel>
            <Input
              type="text"
              name="sellerAddress"
              value={invoiceData.sellerAddress}
              isReadOnly
            />
          </FormControl>

          {/* SIREN */}
          <FormControl id="sellerSiren">
            <Tooltip label="SIREN: Système d'Identification du Répertoire des Entreprises" placement="top">
              <FormLabel>SIREN</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerSiren"
              value={invoiceData.sellerSiren}
              isReadOnly
            />
          </FormControl>

          {/* SIRET */}
          <FormControl id="sellerSiret">
            <Tooltip label="SIRET: Système d'Identification du Répertoire des Etablissements" placement="top">
              <FormLabel>SIRET</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerSiret"
              value={invoiceData.sellerSiret}
              isReadOnly
            />
          </FormControl>

          {/* Forme juridique */}
          <FormControl id="sellerLegalForm">
            <FormLabel>Forme juridique</FormLabel>
            <Input
              type="text"
              name="sellerLegalForm"
              value={invoiceData.sellerLegalForm}
              isReadOnly
            />
          </FormControl>

          {/* Capital */}
          <FormControl id="sellerCapital">
            <Tooltip label="Capital social de l'entreprise" placement="top">
              <FormLabel>Capital</FormLabel>
            </Tooltip>
            <Input
              type="number"
              name="sellerCapital"
              value={invoiceData.sellerCapital}
              isReadOnly
            />
          </FormControl>

          {/* Numéro RCS */}
          <FormControl id="sellerRCS">
            <Tooltip label="RCS: Registre du Commerce et des Sociétés" placement="top">
              <FormLabel>Numéro RCS</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerRCS"
              value={invoiceData.sellerRCS}
              isReadOnly
            />
          </FormControl>

          {/* Greffe */}
          <FormControl id="sellerGreffe">
            <Tooltip label="Greffe: Bureau où sont déposés les actes juridiques" placement="top">
              <FormLabel>Greffe</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerGreffe"
              value={invoiceData.sellerGreffe}
              isReadOnly
            />
          </FormControl>

          {/* Numéro RM */}
          <FormControl id="sellerRM">
            <Tooltip label="RM: Répertoire des Métiers" placement="top">
              <FormLabel>Numéro RM</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerRM"
              value={invoiceData.sellerRM}
              isReadOnly
            />
          </FormControl>

          {/* Numéro de TVA du vendeur */}
          <FormControl id="sellerVATNumber">
            <FormLabel>Numéro de TVA du vendeur</FormLabel>
            <Input
              type="text"
              name="sellerVATNumber"
              value={invoiceData.sellerVATNumber}
              isReadOnly
            />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations sur l'acheteur</Heading>

          {/* Nom de l'acheteur */}
          <FormControl id="buyerName">
            <FormLabel>Nom de l'acheteur</FormLabel>
            <Input
              type="text"
              name="buyerName"
              value={invoiceData.buyerName}
              onChange={handleChange}
            />
          </FormControl>

          {/* Adresse de l'acheteur */}
          <FormControl id="buyerAddress">
            <FormLabel>Adresse de l'acheteur</FormLabel>
            <Input
              type="text"
              name="buyerAddress"
              value={invoiceData.buyerAddress}
              onChange={handleChange}
            />
          </FormControl>

          {/* Adresse de livraison */}
          <FormControl id="deliveryAddress">
            <FormLabel>Adresse de livraison</FormLabel>
            <Input
              type="text"
              name="deliveryAddress"
              value={invoiceData.deliveryAddress}
              onChange={handleChange}
            />
          </FormControl>

          {/* Adresse de facturation */}
          <FormControl id="billingAddress">
            <FormLabel>Adresse de facturation</FormLabel>
            <Input
              type="text"
              name="billingAddress"
              value={invoiceData.billingAddress}
              onChange={handleChange}
            />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Produits/Services</Heading>
          {invoiceData.productDetails.map((product, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius={8} mb={4}>
              <Stack direction="column" spacing={4}>
                <FormControl id={`description-${index}`} isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </FormControl>

                <Stack direction="row" spacing={4}>
                  {/* Quantité */}
                  <FormControl id={`quantity-${index}`} isInvalid={errors[`product-${index}-quantity`]}>
                    <Tooltip label="Quantité du produit ou service" placement="top">
                      <FormLabel>Quantité</FormLabel>
                    </Tooltip>
                    <Input
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, e)}
                      min="0"
                      step="1"
                    />
                    {errors[`product-${index}-quantity`] && <FormErrorMessage>{errors[`product-${index}-quantity`]}</FormErrorMessage>}
                  </FormControl>

                  {/* Prix Unitaire (HT) */}
                  <FormControl id={`unitPrice-${index}`} isInvalid={errors[`product-${index}-unitPrice`]}>
                    <Tooltip label="Prix Unitaire HT: Prix unitaire hors taxes" placement="top">
                      <FormLabel>Prix Unitaire (HT)</FormLabel>
                    </Tooltip>
                    <Input
                      type="number"
                      name="unitPrice"
                      value={product.unitPrice}
                      onChange={(e) => handleProductChange(index, e)}
                      min="0"
                      step="0.01"
                    />
                    {errors[`product-${index}-unitPrice`] && <FormErrorMessage>{errors[`product-${index}-unitPrice`]}</FormErrorMessage>}
                  </FormControl>

                  {/* Taux TVA */}
                  <FormControl id={`vatRate-${index}`} isInvalid={errors[`product-${index}-vatRate`]}>
                    <Tooltip label="TVA: Taxe sur la Valeur Ajoutée" placement="top">
                      <FormLabel>Taux TVA</FormLabel>
                    </Tooltip>
                    <Select
                      name="vatRate"
                      value={product.vatRate}
                      onChange={(e) => handleProductChange(index, e)}
                      placeholder="Sélectionnez un taux"
                    >
                      {VAT_RATES.map(rate => (
                        <option key={rate.value} value={rate.value}>{rate.label}</option>
                      ))}
                    </Select>
                    {errors[`product-${index}-vatRate`] && <FormErrorMessage>{errors[`product-${index}-vatRate`]}</FormErrorMessage>}
                  </FormControl>
                </Stack>

                {/* Bouton de suppression du produit */}
                <IconButton
                  aria-label="Supprimer ce produit"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => removeProduct(index)}
                />
              </Stack>
            </Box>
          ))}

          {/* Bouton d'ajout de produit/service */}
          <Button
            leftIcon={<AddIcon />}
            onClick={addProduct}
            colorScheme="blue"
            variant="outline"
          >
            Ajouter un produit/service
          </Button>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations Financières</Heading>

          {/* Remise */}
          <FormControl id="discount" isInvalid={errors.discount}>
            <Tooltip label="Remise appliquée sur le montant total" placement="top">
              <FormLabel>Remise</FormLabel>
            </Tooltip>
            <Input
              type="number"
              name="discount"
              value={invoiceData.discount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            {errors.discount && <FormErrorMessage>{errors.discount}</FormErrorMessage>}
          </FormControl>

          {/* Total HT */}
          <FormControl id="totalHT">
            <Tooltip label="Total HT est calculé automatiquement. À titre indicatif et à vérifier." placement="top">
              <FormLabel>Total HT</FormLabel>
            </Tooltip>
            <Input
              type="number"
              name="totalHT"
              value={invoiceData.totalHT}
              isReadOnly
              placeholder="Calculé automatiquement"
            />
          </FormControl>

          {/* Total TTC */}
          <FormControl id="totalTTC">
            <Tooltip label="Total TTC est calculé automatiquement. À titre indicatif et à vérifier." placement="top">
              <FormLabel>Total TTC</FormLabel>
            </Tooltip>
            <Input
              type="number"
              name="totalTTC"
              value={invoiceData.totalTTC}
              isReadOnly
              placeholder="Calculé automatiquement"
            />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations de Paiement</Heading>

          {/* Date d'échéance de paiement */}
          <FormControl id="paymentDueDate">
            <FormLabel>Date d'échéance de paiement</FormLabel>
            <Input
              type="date"
              name="paymentDueDate"
              value={invoiceData.paymentDueDate}
              onChange={handleChange}
            />
          </FormControl>

          {/* Conditions de remise */}
          <FormControl id="discountConditions">
            <FormLabel>Conditions de remise</FormLabel>
            <Input
              type="text"
              name="discountConditions"
              value={invoiceData.discountConditions}
              onChange={handleChange}
            />
          </FormControl>

          {/* Pénalités de retard */}
          <FormControl id="latePaymentPenalties">
            <FormLabel>Pénalités de retard</FormLabel>
            <Input
              type="text"
              name="latePaymentPenalties"
              value={invoiceData.latePaymentPenalties}
              onChange={handleChange}
            />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Mentions Spéciales et Garantie</Heading>

          {/* Informations sur la garantie */}
          <FormControl id="warrantyInfo">
            <FormLabel>Informations sur la garantie</FormLabel>
            <Input
              type="text"
              name="warrantyInfo"
              value={invoiceData.warrantyInfo}
              onChange={handleChange}
            />
          </FormControl>

          {/* Mention spéciale */}
          <FormControl id="specialMention">
            <FormLabel>Mention spéciale</FormLabel>
            <Input
              type="text"
              name="specialMention"
              value={invoiceData.specialMention}
              onChange={handleChange}
            />
          </FormControl>

          {/* Bouton de soumission */}
          <Button type="submit" colorScheme="teal" size="lg" mt={6}>
            Soumettre la Facture
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default InvoiceForm;
