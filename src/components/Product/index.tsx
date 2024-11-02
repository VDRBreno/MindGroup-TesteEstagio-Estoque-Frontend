import { FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { IProduct } from '@/types/Product';
import api from '@/services/api';
import Button from '@/components/Button';
import EditProductModal from '@/components/ModalContents/EditProductModal';
import useModal from '@/hooks/useModal';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { toastStyle } from '@/styles/toastify';
import { FormattedError } from '@/utils/HandleError';
import useAuth from '@/hooks/useAuth';

import styles from './styles.module.scss';

interface ProductProps {
  product: IProduct;
  updateProductList: () => void;
}

export default function Product({
  product,
  updateProductList
}: ProductProps) {

  const { authToken } = useAuth();
  const { openModal } = useModal();

  function handleOpenEditProductModal() {
    openModal({ element: <EditProductModal product={product} onSubmit={updateProductList} /> });
  }

  async function handleRemoveProduct() {
    if(confirm(`Tem certeza que deseja remover o produto: ${product.name}?`)) {
      try {

        await api.delete(`/product/delete/${product.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        toast.success('Produto removido!', toastStyle.success);

        updateProductList();

      } catch(error) {
        console.error(error);
  
        const axiosError = getAxiosErrorResponse(error);
        if(axiosError) {
          toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
        } else if(error instanceof FormattedError) {
          toast.error(`Erro: ${error.description}`, toastStyle.error);
        } else {
          toast.error('Não foi possível remover o produto', toastStyle.error);
        }
      }
    }
  }

  return (
    <div id={styles.Container}>
      <div className={styles.RemoveButtonContainer}>
        <Button onClick={handleRemoveProduct} style={{ backgroundColor: '#D35757', padding: '15px', height: 'auto' }}>
          <FiTrash size={15} color='#FFFFFF' />
        </Button>
      </div>
      <div className={styles.EditButtonContainer}>
        <Button onClick={handleOpenEditProductModal} style={{ padding: '10px 15px', height: 'auto', fontSize: '0.8rem' }}>
          Editar
        </Button>
      </div>
      <div className={styles.ImageContainer}>
        <img className={styles.Image} src={api.defaults.baseURL+'/images/'+product.image_name} alt={product.image_name} />
      </div>
      <div className={styles.Content}>
        <span className={styles.Name}>{product.name}</span>
        <div className={styles.InLine} style={{ justifyContent: 'space-between' }}>
          <span className={styles.Price}>R$ {product.value.toFixed(2).split('.').join(',')}</span>
          <span className={styles.Quantity}>{product.quantity} <span className={styles.QuantityUnd}>und</span></span>
        </div>
      </div>
    </div>
  );
}