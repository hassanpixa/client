import './App.css';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { QrSection, getQR } from './utils/polotnoQrSection';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';
import Savebutton from './polotno-editor/components/saveButton/Savebutton';
import { CustomTemplateTab } from './polotno-editor/components/customTemplateTab/CustomTemplateTab';
import { CustomResizePanel } from './polotno-editor/components/customResizePanel/CustomResizePanel';

function App({ store }) {
  // const val = 'https://polotno.com/';
  // getQR(val).then((src) => {
  //   store.activePage?.addElement({
  //     type: 'svg',
  //     name: 'qr',
  //     x: store.width / 2 - 150,
  //     y: store.height / 2 - 150,
  //     width: 300,
  //     height: 300,
  //     src,
  //     custom: {
  //       value: val,
  //     },
  //   });
  // });
  
  // we will have just two sections
  const ResizeSection = DEFAULT_SECTIONS.find(
    (section) => section.name === "size"
  );
  // overwrite its panel component
  ResizeSection.Panel = CustomResizePanel;
  
  const sections = [QrSection,CustomTemplateTab, ...DEFAULT_SECTIONS];
  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
      <SidePanelWrap>
        <SidePanel store={store} sections={sections}  />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store}  components={{ActionControls: Savebutton}} hideImageRemoveBackground />
        <Workspace store={store} />
        <ZoomButtons store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
}

export default App;
