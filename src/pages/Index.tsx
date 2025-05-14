
import PageHeader from "@/components/PageHeader";
import PageFooter from "@/components/PageFooter";
import FileConverterTabs from "@/components/FileConverterTabs";
import AboutSection from "@/components/AboutSection";

const Index = () => {
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
};

export default Index;
