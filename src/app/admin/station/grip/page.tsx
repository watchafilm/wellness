
import StationPageClient from '@/components/admin/StationPageClient';

export const metadata = {
  title: 'Data Entry: Grip Strength',
};

export default function GripStationPage() {
    return <StationPageClient stationKey="grip" />;
}
