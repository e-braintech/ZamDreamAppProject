import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

const BottomSheetBackdropHandler = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} pressBehavior="close" />;
};

export default BottomSheetBackdropHandler;
