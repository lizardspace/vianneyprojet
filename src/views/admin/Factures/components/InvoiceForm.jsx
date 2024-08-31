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
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FcMoneyTransfer } from 'react-icons/fc';

const InvoiceForm = () => {
  const toast = useToast();

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
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...invoiceData.productDetails];
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

    // Extraction des données des produits/services
    const productDescriptions = invoiceData.productDetails.map(item => item.description);
    const productQuantities = invoiceData.productDetails.map(item => item.quantity);
    const productUnitPrices = invoiceData.productDetails.map(item => item.unitPrice);
    const productVatRates = invoiceData.productDetails.map(item => item.vatRate);

    // Insertion des données dans la table `vianney_factures`
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
        special_mention: invoiceData.specialMention
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
            <FormControl id="sellerSiren">
              <FormLabel>SIREN</FormLabel>
              <Input type="text" name="sellerSiren" value={invoiceData.sellerSiren} onChange={handleChange} />
            </FormControl>

            <FormControl id="sellerSiret">
              <FormLabel>SIRET</FormLabel>
              <Input type="text" name="sellerSiret" value={invoiceData.sellerSiret} onChange={handleChange} />
            </FormControl>
          </Stack>

          <FormControl id="sellerLegalForm">
            <FormLabel>Forme juridique</FormLabel>
            <Input type="text" name="sellerLegalForm" value={invoiceData.sellerLegalForm} onChange={handleChange} />
          </FormControl>

          <Stack direction="row" spacing={4}>
            <FormControl id="sellerCapital">
              <FormLabel>Capital</FormLabel>
              <Input type="text" name="sellerCapital" value={invoiceData.sellerCapital} onChange={handleChange} />
            </FormControl>

            <FormControl id="sellerRCS">
              <FormLabel>Numéro RCS</FormLabel>
              <Input type="text" name="sellerRCS" value={invoiceData.sellerRCS} onChange={handleChange} />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={4}>
            <FormControl id="sellerGreffe">
              <FormLabel>Greffe</FormLabel>
              <Input type="text" name="sellerGreffe" value={invoiceData.sellerGreffe} onChange={handleChange} />
            </FormControl>

            <FormControl id="sellerRM">
              <FormLabel>Numéro RM</FormLabel>
              <Input type="text" name="sellerRM" value={invoiceData.sellerRM} onChange={handleChange} />
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

                <FormControl id={`quantity-${index}`} isRequired>
                  <FormLabel>Quantité</FormLabel>
                  <Input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                </FormControl>

                <FormControl id={`unitPrice-${index}`} isRequired>
                  <FormLabel>Prix Unitaire (HT)</FormLabel>
                  <Input
                    type="number"
                    name="unitPrice"
                    value={product.unitPrice}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                </FormControl>

                <FormControl id={`vatRate-${index}`} isRequired>
                  <FormLabel>Taux TVA</FormLabel>
                  <Input
                    type="number"
                    name="vatRate"
                    value={product.vatRate}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
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

          <FormControl id="discount">
            <FormLabel>Remise</FormLabel>
            <Input type="text" name="discount" value={invoiceData.discount} onChange={handleChange} />
          </FormControl>

          <FormControl id="totalHT" isRequired>
            <FormLabel>Total HT</FormLabel>
            <Input type="number" name="totalHT" value={invoiceData.totalHT} onChange={handleChange} required />
          </FormControl>

          <FormControl id="totalTTC" isRequired>
            <FormLabel>Total TTC</FormLabel>
            <Input type="number" name="totalTTC" value={invoiceData.totalTTC} onChange={handleChange} required />
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
