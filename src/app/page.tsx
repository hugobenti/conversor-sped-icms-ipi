import AboutSection from "../components/AboutSection";
import FileConverterTabs from "../components/FileConverterTabs";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="container mx-auto px-4 py-8">
        <FileConverterTabs />

        <AboutSection />
      </main>

      <PageFooter />
    </div>
  );
}
