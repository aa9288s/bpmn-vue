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
        get() {

        },
        set(e, assignment) {
            e.setAttributes(assignment)
        }
    }
]
