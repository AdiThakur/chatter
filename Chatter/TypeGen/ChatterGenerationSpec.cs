using System.Reflection;
using TypeGen.Core.SpecGeneration;

namespace Chatter.TypeGen
{
    public class ChatterGenerationSpec : GenerationSpec
    {
        private const string OutputDir = "../ChatterApp/src/types";

        public override void OnBeforeGeneration(OnBeforeGenerationArgs args)
        {
            var allModelTypes = GetAllClassesInNameSpace("Chatter.Data.Models");
            foreach (var modelType in allModelTypes)
            {
                AddClass(modelType, OutputDir);
            }
        }

        private static List<Type> GetAllClassesInNameSpace(string nameSpace)
        {
            return Assembly.GetExecutingAssembly()
                .GetExportedTypes()
                .Where(t => t.IsClass && t.Namespace == nameSpace)
                .ToList();
        }
    }
}