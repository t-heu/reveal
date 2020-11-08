import React, {createContext, useState, useContext, useRef} from 'react';

interface ImodalBottom {
  viewer_has_hidePost: boolean;
  id: string;
}

interface ShareStateComponentContextData {
  visibleModalNotification: boolean;
  setVisibleModalNotification: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostData: ImodalBottom;
  refRBSheet: React.MutableRefObject<undefined>;
  openModalBottomSheetPost(id: ImodalBottom): void;
}

const ShareStateComponentContext = createContext<
  ShareStateComponentContextData
>({} as ShareStateComponentContextData);

const ShareStateComponentProvider: React.FC = ({children}) => {
  const refRBSheet = useRef<any>();
  const [visibleModalNotification, setVisibleModalNotification] = useState(
    false,
  );
  const [modalPostData, setModalPostData] = useState<ImodalBottom>(
    {} as ImodalBottom,
  );

  function openModalBottomSheetPost({id, viewer_has_hidePost}: ImodalBottom) {
    refRBSheet.current.open();
    setModalPostData({
      viewer_has_hidePost,
      id,
    });
  }

  return (
    <ShareStateComponentContext.Provider
      value={{
        visibleModalNotification,
        setVisibleModalNotification,
        refRBSheet,
        modalPostData,
        openModalBottomSheetPost,
      }}>
      {children}
    </ShareStateComponentContext.Provider>
  );
};

function useShareStateComponent(): ShareStateComponentContextData {
  const context = useContext(ShareStateComponentContext);

  if (!context) {
    throw new Error(
      'useShareStateComponent must be used within an ShareStateComponentProvider',
    );
  }

  return context;
}

export {ShareStateComponentProvider, useShareStateComponent};
