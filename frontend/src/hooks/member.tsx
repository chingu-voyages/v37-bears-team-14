// export const MemberContext

/**
 * Usage:
 *   function UsageComponent() {
 *     const { projectId } = useParams(); // from react-router-dom
 *     const { isMember, roleName } = useMember(projectId);
 *     if (isMember && roleName === "owner") {
 *       return <Button>Edit</Button>
 *     } else {
 *       return <Button disabled>Edit</Button>
 *     }
 *   }
 * @param projectId
 */
export function useMember(projectId: string) {}
