import DIO from '../ti-components/controllers/DIO';
import MFC from '../ti-components/controllers/MFC';
import EPC from '../ti-components/controllers/EPC';
import Heater from '../ti-components/controllers/Heater';

type Controller = DIO | EPC | Heater | MFC;

export default Controller;
