import arElectricalCategory from './pages/AR_Electrical_Category';
import arFireCategory from './pages/AR_Fire_Category';
import arHvacCategory from './pages/AR_HVAC_Category';
import arHazenwilliamsCalculator from './pages/AR_HazenWilliams_Calculator';
import arLoadscheduleCalculator from './pages/AR_LoadSchedule_Calculator';
import arPlumbingCategory from './pages/AR_Plumbing_Category';
import CalculatorPage from './pages/CalculatorPage';
import CategoryPage from './pages/CategoryPage';
import enElectricalCategory from './pages/EN_Electrical_Category';
import enFireCategory from './pages/EN_Fire_Category';
import enHvacCategory from './pages/EN_HVAC_Category';
import enHazenwilliamsCalculator from './pages/EN_HazenWilliams_Calculator';
import enLoadscheduleCalculator from './pages/EN_LoadSchedule_Calculator';
import enPlumbingCategory from './pages/EN_Plumbing_Category';
import Home from './pages/Home';
import PrivacyPage from './pages/PrivacyPage';
import StandardsPage from './pages/StandardsPage';
import TermsPage from './pages/TermsPage';
import UnitConverterDetail from './pages/UnitConverterDetail';
import UnitConverterHub from './pages/UnitConverterHub';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AR_Electrical_Category": arElectricalCategory,
    "AR_Fire_Category": arFireCategory,
    "AR_HVAC_Category": arHvacCategory,
    "AR_HazenWilliams_Calculator": arHazenwilliamsCalculator,
    "AR_LoadSchedule_Calculator": arLoadscheduleCalculator,
    "AR_Plumbing_Category": arPlumbingCategory,
    "CalculatorPage": CalculatorPage,
    "CategoryPage": CategoryPage,
    "EN_Electrical_Category": enElectricalCategory,
    "EN_Fire_Category": enFireCategory,
    "EN_HVAC_Category": enHvacCategory,
    "EN_HazenWilliams_Calculator": enHazenwilliamsCalculator,
    "EN_LoadSchedule_Calculator": enLoadscheduleCalculator,
    "EN_Plumbing_Category": enPlumbingCategory,
    "Home": Home,
    "PrivacyPage": PrivacyPage,
    "StandardsPage": StandardsPage,
    "TermsPage": TermsPage,
    "UnitConverterDetail": UnitConverterDetail,
    "UnitConverterHub": UnitConverterHub,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};