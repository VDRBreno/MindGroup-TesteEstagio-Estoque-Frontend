import { IProduct } from '@/types/Product';
import api from '@/services/api';
import Button from '@/components/Button';
import EditProductModal from '@/components/ModalContents/EditProductModal';
import useModal from '@/hooks/useModal';

import styles from './styles.module.scss';

interface ProductProps {
  product: IProduct;
}

export default function Product({
  product
}: ProductProps) {

  const { openModal } = useModal();

  function handleOpenEditProductModal() {
    openModal({ element: <EditProductModal product={product} /> });
  }

  return (
    <div id={styles.Container}>
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