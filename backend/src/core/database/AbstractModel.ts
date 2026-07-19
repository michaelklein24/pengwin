export default abstract class AbstractModel {
    public createdAt: Date = new Date();
    public createdBy: string = '';
    public updatedAt: Date = new Date();
    public updatedBy: string = '';
}
