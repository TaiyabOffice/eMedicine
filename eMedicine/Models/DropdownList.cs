namespace eMedicine.Models
{
    public class DropdownList
    {
        public string procedureName { get; set; }
        public string callName { get; set; }
        public string param1 { get; set; }
        public string param2 { get; set; }
        public string param3 { get; set; }
        public string param4 { get; set; }
        public string param5 { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }

    }

    public class Categories
    {
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
    }
}
