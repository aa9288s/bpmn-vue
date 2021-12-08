export default [
    {
        name: "id",
        label: "id",
        type: "string",
        allow: [
            "bpmn:BaseElement"
        ]
    },
    {
        name: "name",
        label: "名称",
        type: "string",
        allow: [
            "bpmn:BaseElement"
        ]
    },
    {
        name: "documentation",
        label: "文档",
        type: "documentation",
        allow: [
            "bpmn:BaseElement"
        ],
        get: (e) => {
            const documentation = e.getAttribute('documentation')
            if (documentation && documentation.length) {
                return documentation[0].get('text')
            } else {
                return ''
            }
        },
        set(e, text) {
            if (text) {
                e.setAttribute('documentation', [
                    e.createElement('bpmn:Documentation', {
                        text: text
                    })
                ])
            } else {
                e.setAttribute('documentation', [])
            }
        }
    },
    {
        name: "assignable",
        label: "任务分配",
        type: "assignment",
        allow: [
            "bpmn:UserTask"
        ],
        get(e) {
            return e.getExtension('modeler:Assignment')
        },
        set(e, assignments) {
            let props = {}
            assignments['assignee'].forEach(assignee => {
                props['assignee'] = e.createElement('modeler:Assignee', assignee)
            })
            assignments['candidateUsers'].forEach(candidateUser => {
                props['candidateUsers'] = props['candidateUsers'] || []
                props['candidateUsers'].push(e.createElement('modeler:CandidateUser', candidateUser))
            })
            assignments['candidateGroups'].forEach(candidateGroup => {
                props['candidateGroups'] = props['candidateGroups'] || []
                props['candidateGroups'].push(e.createElement('modeler:CandidateGroup', candidateGroup))
            })
            assignments['candidateRoles'].forEach(candidateRole => {
                props['candidateRoles'] = props['candidateRoles'] || []
                props['candidateRoles'].push(e.createElement('modeler:CandidateRole', candidateRole))
            })
            e.setExtension('modeler:Assignment', props)

            props = {}
            Object.keys(assignments).forEach(key => {
                const assignment = assignments[key]
                if (assignment.length) {
                    const array = []
                    assignment.forEach(e => array.push(e.id))
                    props[key] = array.join(',')
                } else {
                    props[key] = undefined
                }
            })
            e.setAttributes(props)
        }
    }
]
