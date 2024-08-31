import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FcMoneyTransfer } from 'react-icons/fc';
import { useEvent } from '../../../../EventContext'; // Import the EventContext

const InvoiceForm = () => {
  const toast = useToast();
  const { selectedEventId } = useEvent(); // Get the selectedEventId from context
  const [errors, setErrors] = useState({});
  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: '',
    invoiceNumber: '',
    saleDate: '',
    sellerName: '',
    sellerAddress: '',
    sellerSiren: '',
    sellerSiret: '',
    sellerLegalForm: '',
    sellerCapital: '',
    sellerRCS: '',
    sellerGreffe: '',
    sellerRM: '',
    buyerName: '',
    buyerAddress: '',
    deliveryAddress: '',
    billingAddress: '',
    orderNumber: '',
    sellerVATNumber: '',
    buyerVATNumber: '',
    productDetails: [{ description: '', quantity: '', unitPrice: '', vatRate: '' }],
    discount: '',
    totalHT: '',
    totalTTC: '',
    paymentDueDate: '',
    discountConditions: '',
    latePaymentPenalties: '',
    warrantyInfo: '',
    specialMention: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['sellerSiren', 'sellerSiret', 'sellerCapital', 'sellerRCS', 'sellerGreffe', 'sellerRM', 'sellerVATNumber', 'buyerVATNumber', 'discount', 'totalHT', 'totalTTC'].includes(name)) {
      if (!/^\d*$/.test(value)) {
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

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...invoiceData.productDetails];

    if (['quantity', 'unitPrice', 'vatRate'].includes(name)) {
      if (!/^\d*\.?\d*$/.test(value)) {
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

  const addProduct = () => {
    setInvoiceData({
      ...invoiceData,
      productDetails: [...invoiceData.productDetails, { description: '', quantity: '', unitPrice: '', vatRate: '' }]
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = invoiceData.productDetails.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, productDetails: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productDescriptions = invoiceData.productDetails.map(item => item.description);
    const productQuantities = invoiceData.productDetails.map(item => item.quantity);
    const productUnitPrices = invoiceData.productDetails.map(item => item.unitPrice);
    const productVatRates = invoiceData.productDetails.map(item => item.vatRate);

    const { error } = await supabase
      .from('vianney_factures')
      .insert({
        invoice_date: invoiceData.invoiceDate,
        invoice_number: invoiceData.invoiceNumber,
        sale_date: invoiceData.saleDate,
        seller_name: invoiceData.sellerName,
        seller_address: invoiceData.sellerAddress,
        seller_siren: invoiceData.sellerSiren,
        seller_siret: invoiceData.sellerSiret,
        seller_legal_form: invoiceData.sellerLegalForm,
        seller_capital: invoiceData.sellerCapital,
        seller_rcs: invoiceData.sellerRCS,
        seller_greffe: invoiceData.sellerGreffe,
        seller_rm: invoiceData.sellerRM,
        buyer_name: invoiceData.buyerName,
        buyer_address: invoiceData.buyerAddress,
        delivery_address: invoiceData.deliveryAddress,
        billing_address: invoiceData.billingAddress,
        order_number: invoiceData.orderNumber,
        seller_vat_number: invoiceData.sellerVATNumber,
        buyer_vat_number: invoiceData.buyerVATNumber,
        product_descriptions: productDescriptions,
        product_quantities: productQuantities,
        product_unit_prices: productUnitPrices,
        product_vat_rates: productVatRates,
        discount: invoiceData.discount,
        total_ht: invoiceData.totalHT,
        total_ttc: invoiceData.totalTTC,
        payment_due_date: invoiceData.paymentDueDate,
        discount_conditions: invoiceData.discountConditions,
        late_payment_penalties: invoiceData.latePaymentPenalties,
        warranty_info: invoiceData.warrantyInfo,
        special_mention: invoiceData.specialMention,
        event_id: selectedEventId, // Add event_id from context
      });

    if (error) {
      console.error('Error inserting invoice:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la soumission de la facture.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('Invoice submitted successfully');
      toast({
        title: 'Succès',
        description: 'Facture soumise avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} display="flex" alignItems="center">
        <FcMoneyTransfer style={{ marginRight: '10px' }} />
        Gestion des Factures
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="invoiceDate">
            <FormLabel>Date de la facture</FormLabel>
            <Input type="date" name="invoiceDate" value={invoiceData.invoiceDate} onChange={handleChange} required />
          </FormControl>

          <FormControl id="invoiceNumber">
            <FormLabel>Numéro de la facture</FormLabel>
            <Input type="text" name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleChange} required />
          </FormControl>

          <FormControl id="saleDate">
            <FormLabel>Date de la vente/prestation</FormLabel>
            <Input type="date" name="saleDate" value={invoiceData.saleDate} onChange={handleChange} required />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations sur le vendeur</Heading>

          <FormControl id="sellerName">
            <FormLabel>Nom du vendeur</FormLabel>
            <Input type="text" name="sellerName" value={invoiceData.sellerName} onChange={handleChange} required />
          </FormControl>

          <FormControl id="sellerAddress">
            <FormLabel>Adresse du vendeur</FormLabel>
            <Input type="text" name="sellerAddress" value={invoiceData.sellerAddress} onChange={handleChange} required />
          </FormControl>

          <Stack direction="row" spacing={4}>
            <FormControl id="sellerSiren" isInvalid={errors.sellerSiren}>
              <Tooltip label="SIREN: Système d'Identification du Répertoire des Entreprises" placement="top">
                <FormLabel>SIREN</FormLabel>
              </Tooltip>
              <Input type="text" name="sellerSiren" value={invoiceData.sellerSiren} onChange={handleChange} />
              {errors.sellerSiren && <FormErrorMessage>{errors.sellerSiren}</FormErrorMessage>}
            </FormControl>

            <FormControl id="sellerSiret" isInvalid={errors.sellerSiret}>
              <Tooltip label="SIRET: Système d'Identification du Répertoire des Etablissements" placement="top">
                <FormLabel>SIRET</FormLabel>
              </Tooltip>
              <Input type="text" name="sellerSiret" value={invoiceData.sellerSiret} onChange={handleChange} />
              {errors.sellerSiret && <FormErrorMessage>{errors.sellerSiret}</FormErrorMessage>}
            </FormControl>
          </Stack>

          <FormControl id="sellerLegalForm">
            <FormLabel>Forme juridique</FormLabel>
            <Input type="text" name="sellerLegalForm" value={invoiceData.sellerLegalForm} onChange={handleChange} />
          </FormControl>

          <Stack direction="row" spacing={4}>
            <FormControl id="sellerCapital" isInvalid={errors.sellerCapital}>
              <Tooltip label="Capital social de l'entreprise" placement="top">
                <FormLabel>Capital</FormLabel>
              </Tooltip>
              <Input type="text" name="sellerCapital" value={invoiceData.sellerCapital} onChange={handleChange} />
              {errors.sellerCapital && <FormErrorMessage>{errors.sellerCapital}</FormErrorMessage>}
            </FormControl>

            <FormControl id="sellerRCS" isInvalid={errors.sellerRCS}>
              <Tooltip label="RCS: Registre du Commerce et des Sociétés" placement="top">
                <FormLabel>Numéro RCS</FormLabel>
              </Tooltip>
              <Input type="text" name="sellerRCS" value={invoiceData.sellerRCS} onChange={handleChange} />
              {errors.sellerRCS && <FormErrorMessage>{errors.sellerRCS}</FormErrorMessage>}
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={4}>
            <FormControl id="sellerGreffe" isInvalid={errors.sellerGreffe}>
              <Tooltip label="Greffe: Bureau où sont déposés les actes juridiques" placement="top">
                <FormLabel>Greffe</FormLabel>
              </Tooltip>
              <Input type="text" name="sellerGreffe" value={invoiceData.sellerGreffe} onChange={handleChange} />
              {errors.sellerGreffe && <FormErrorMessage>{errors.sellerGreffe}</FormErrorMessage>}
            </FormControl>

            <FormControl id="sellerRM" isInvalid={errors.sellerRM}>
              <Tooltip label="RM: Répertoire des Métiers" placement="top">
                <FormLabel>Numéro RM</FormLabel>
              </Tooltip>
              <Input type="text" name="sellerRM" value={invoiceData.sellerRM} onChange={handleChange} />
              {errors.sellerRM && <FormErrorMessage>{errors.sellerRM}</FormErrorMessage>}
            </FormControl>
          </Stack>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations sur l'acheteur</Heading>

          <FormControl id="buyerName">
            <FormLabel>Nom de l'acheteur</FormLabel>
            <Input type="text" name="buyerName" value={invoiceData.buyerName} onChange={handleChange} required />
          </FormControl>

          <FormControl id="buyerAddress">
            <FormLabel>Adresse de l'acheteur</FormLabel>
            <Input type="text" name="buyerAddress" value={invoiceData.buyerAddress} onChange={handleChange} required />
          </FormControl>

          <FormControl id="deliveryAddress">
            <FormLabel>Adresse de livraison</FormLabel>
            <Input type="text" name="deliveryAddress" value={invoiceData.deliveryAddress} onChange={handleChange} />
          </FormControl>

          <FormControl id="billingAddress">
            <FormLabel>Adresse de facturation</FormLabel>
            <Input type="text" name="billingAddress" value={invoiceData.billingAddress} onChange={handleChange} />
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Produits/Services</Heading>
          {invoiceData.productDetails.map((product, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius={8} mb={4}>
              <Stack direction="row" alignItems="center">
                <FormControl id={`description-${index}`} isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                </FormControl>

                <FormControl id={`quantity-${index}`} isRequired isInvalid={errors[`product-${index}-quantity`]}>
                  <Tooltip label="Quantité du produit ou service" placement="top">
                    <FormLabel>Quantité</FormLabel>
                  </Tooltip>
                  <Input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                  {errors[`product-${index}-quantity`] && <FormErrorMessage>{errors[`product-${index}-quantity`]}</FormErrorMessage>}
                </FormControl>

                <FormControl id={`unitPrice-${index}`} isRequired isInvalid={errors[`product-${index}-unitPrice`]}>
                  <Tooltip label="Prix Unitaire HT: Prix unitaire hors taxes" placement="top">
                    <FormLabel>Prix Unitaire (HT)</FormLabel>
                  </Tooltip>
                  <Input
                    type="number"
                    name="unitPrice"
                    value={product.unitPrice}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                  {errors[`product-${index}-unitPrice`] && <FormErrorMessage>{errors[`product-${index}-unitPrice`]}</FormErrorMessage>}
                </FormControl>

                <FormControl id={`vatRate-${index}`} isRequired isInvalid={errors[`product-${index}-vatRate`]}>
                  <Tooltip label="TVA: Taxe sur la Valeur Ajoutée" placement="top">
                    <FormLabel>Taux TVA</FormLabel>
                  </Tooltip>
                  <Input
                    type="number"
                    name="vatRate"
                    value={product.vatRate}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                  {errors[`product-${index}-vatRate`] && <FormErrorMessage>{errors[`product-${index}-vatRate`]}</FormErrorMessage>}
                </FormControl>

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

          <FormControl id="discount" isInvalid={errors.discount}>
            <Tooltip label="Remise appliquée sur le montant total" placement="top">
              <FormLabel>Remise</FormLabel>
            </Tooltip>
            <Input type="text" name="discount" value={invoiceData.discount} onChange={handleChange} />
            {errors.discount && <FormErrorMessage>{errors.discount}</FormErrorMessage>}
          </FormControl>

          <FormControl id="totalHT" isRequired isInvalid={errors.totalHT}>
            <Tooltip label="Total HT: Montant total hors taxes" placement="top">
              <FormLabel>Total HT</FormLabel>
            </Tooltip>
            <Input type="number" name="totalHT" value={invoiceData.totalHT} onChange={handleChange} required />
            {errors.totalHT && <FormErrorMessage>{errors.totalHT}</FormErrorMessage>}
          </FormControl>

          <FormControl id="totalTTC" isRequired isInvalid={errors.totalTTC}>
            <Tooltip label="Total TTC: Montant total toutes taxes comprises" placement="top">
              <FormLabel>Total TTC</FormLabel>
            </Tooltip>
            <Input type="number" name="totalTTC" value={invoiceData.totalTTC} onChange={handleChange} required />
            {errors.totalTTC && <FormErrorMessage>{errors.totalTTC}</FormErrorMessage>}
          </FormControl>

          <Divider my={6} />

          <Heading as="h3" size="md">Informations de Paiement</Heading>

          <FormControl id="paymentDueDate" isRequired>
            <FormLabel>Date d'échéance de paiement</FormLabel>
            <Input
              type="date"
              name="paymentDueDate"
              value={invoiceData.paymentDueDate}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl id="discountConditions">
            <FormLabel>Conditions de remise</FormLabel>
            <Input type="text" name="discountConditions" value={invoiceData.discountConditions} onChange={handleChange} />
          </FormControl>

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

          <FormControl id="warrantyInfo">
            <FormLabel>Informations sur la garantie</FormLabel>
            <Input type="text" name="warrantyInfo" value={invoiceData.warrantyInfo} onChange={handleChange} />
          </FormControl>

          <FormControl id="specialMention">
            <FormLabel>Mention spéciale</FormLabel>
            <Input type="text" name="specialMention" value={invoiceData.specialMention} onChange={handleChange} />
          </FormControl>

          <Button type="submit" colorScheme="teal" size="lg" mt={6}>
            Soumettre la Facture
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default InvoiceForm;
