
import StationPageClient from '@/components/admin/StationPageClient';

export const metadata = {
  title: 'Data Entry: Waist-Height Ratio',
};

export default function WhRatioStationPage() {
    return <StationPageClient stationKey="wh_ratio" />;
}
