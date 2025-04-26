<template>
    <div class="flex flex-col items-center space-y-6 p-8">
        <label class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer">
            Upload RDF/XML
            <input type="file" accept=".xml,.rdf" @change="handleFileUpload" class="hidden" />
        </label>

        <img v-if="imageSrc" :src="imageSrc" alt="Generated RDF Graph" class="border shadow-lg" />
    </div>

    <div ref="hiddenGraph" class="w-[800px] h-[600px] absolute top-[-9999px] left-[-9999px]" />
</template>

<script setup>
import { ref, nextTick } from 'vue'
import * as $rdf from 'rdflib'
import { Network } from 'vis-network'

const imageSrc = ref('')
const hiddenGraph = ref(null)

const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = async (e) => {
            const content = e.target.result
            const triples = parseRdf(content)
            await drawAndExportGraph(triples)
        }
        reader.readAsText(file)
    }
}

const parseRdf = (content) => {

    const store = $rdf.graph()
    const contentType = 'application/rdf+xml'
    const baseUrl = 'http://example.org/base#'
    const baseNamespace = 'http://example.org/schema#'


    try {
        $rdf.parse(content, store, baseUrl, contentType)
        return store.statements.map(triple => ({
            subject: triple.subject.value.replace(baseNamespace, ''),
            predicate: triple.predicate.value.replace(baseNamespace, ''),
            object: triple.object.value.replace(baseNamespace, ''),
        }))
    } catch (error) {
        console.error('Failed to parse RDF:', error)
        return []
    }
}


const drawAndExportGraph = async (triples) => {
    const nodesMap = new Map()
    const edges = []

    triples.forEach(({ subject, predicate, object }) => {
        if (!nodesMap.has(subject)) nodesMap.set(subject, { id: subject, label: subject })
        if (!nodesMap.has(object)) nodesMap.set(object, { id: object, label: object })

        edges.push({
            from: subject,
            to: object,
            label: predicate,
            arrows: 'to',
        })
    })

    const nodes = Array.from(nodesMap.values())
    await nextTick()

    const container = hiddenGraph.value

    const network = new Network(container, { nodes, edges }, {
        layout: { hierarchical: false },
        physics: { stabilization: true },
    })

    network.once('afterDrawing', (ctx) => {
        const dataUrl = ctx.canvas.toDataURL('image/png')
        imageSrc.value = dataUrl
        network.destroy()
    })
}
</script>