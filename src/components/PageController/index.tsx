import { FiChevronLeft, FiChevronRight, FiChevronsLeft } from 'react-icons/fi';

import styles from './styles.module.scss';

interface PageControllerProps {
  page: number;
  changePage: (newPage: number) => void;
  nextButtonIsVisible: boolean;
}

export default function PageController({
  page,
  changePage,
  nextButtonIsVisible
}: PageControllerProps) {
  return (
    <div id={styles.Container}>
      <div className={styles.PageButtons}>
        <div className={styles.LabelPageIndicator}>Pagina</div>
        {page>1 ? (<>
          <div className={styles.PageButton} onClick={() => changePage(1)}><FiChevronsLeft size={18} color='#FFFFF' /></div>
          <div className={styles.PageButton} onClick={() => changePage(page-1)}><FiChevronLeft size={18} color='#FFFFF' /></div>
        </>) :null}
        <div className={styles.LabelPage}>{page}</div>
        {nextButtonIsVisible ?<div className={styles.PageButton} onClick={() => changePage(page+1)}><FiChevronRight size={18} color='#FFFFFF' /></div> :null}
      </div>
    </div>
  );
}